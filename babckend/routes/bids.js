import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDB } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { sendNotification } from '../config/socket.js';

const router = express.Router();

// Submit a bid
router.post('/', authenticateToken, requireRole(['shop_owner']), [
  body('requirementId').isInt(),
  body('price').isFloat({ min: 0 }),
  body('warrantyDetails').optional().trim(),
  body('message').optional().trim(),
  body('expiryDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { requirementId, price, warrantyDetails, message, expiryDate } = req.body;
    const db = getDB();

    // Get shop ID for the authenticated user
    const [shops] = await db.execute(
      'SELECT id FROM shops WHERE user_id = ?',
      [req.user.id]
    );

    if (shops.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shop profile not found' 
      });
    }

    const shopId = shops[0].id;

    // Check if requirement exists and is active
    const [requirements] = await db.execute(
      'SELECT customer_id, status FROM requirements WHERE id = ? AND status = "active" AND expiry_date > NOW()',
      [requirementId]
    );

    if (requirements.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Requirement not found or expired' 
      });
    }

    // Check if bid already exists
    const [existingBids] = await db.execute(
      'SELECT id FROM bids WHERE requirement_id = ? AND shop_id = ?',
      [requirementId, shopId]
    );

    if (existingBids.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already submitted a bid for this requirement' 
      });
    }

    // Create bid
    const [result] = await db.execute(
      'INSERT INTO bids (requirement_id, shop_id, price, warranty_details, message, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
      [requirementId, shopId, price, warrantyDetails || null, message || null, expiryDate]
    );

    // Notify customer about new bid
    const customerId = requirements[0].customer_id;
    const notification = {
      user_id: customerId,
      title: 'New Bid Received',
      message: `You received a new bid of LKR ${price.toLocaleString()} for your requirement`,
      type: 'bid_received',
      related_id: result.insertId
    };

    await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, related_id) VALUES (?, ?, ?, ?, ?)',
      [notification.user_id, notification.title, notification.message, notification.type, notification.related_id]
    );

    // Send real-time notification
    if (req.io) {
      sendNotification(req.io, customerId, notification);
    }

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bidId: result.insertId
    });
  } catch (error) {
    console.error('Bid creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit bid' 
    });
  }
});

// Get bids for a requirement (customer only)
router.get('/requirement/:id', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const db = getDB();
    
    // Verify customer owns the requirement
    const [requirements] = await db.execute(
      'SELECT id FROM requirements WHERE id = ? AND customer_id = ?',
      [req.params.id, req.user.id]
    );

    if (requirements.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Requirement not found or unauthorized' 
      });
    }

    const [bids] = await db.execute(`
      SELECT b.*, s.shop_name, s.average_rating, s.total_reviews, u.email, u.phone
      FROM bids b
      JOIN shops s ON b.shop_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE b.requirement_id = ? AND b.expiry_date > NOW()
      ORDER BY b.created_at DESC
    `, [req.params.id]);

    res.json({
      success: true,
      bids
    });
  } catch (error) {
    console.error('Bids fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bids' 
    });
  }
});

// Get shop's bids
router.get('/my', authenticateToken, requireRole(['shop_owner']), async (req, res) => {
  try {
    const db = getDB();
    
    // Get shop ID
    const [shops] = await db.execute(
      'SELECT id FROM shops WHERE user_id = ?',
      [req.user.id]
    );

    if (shops.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shop profile not found' 
      });
    }

    const [bids] = await db.execute(`
      SELECT b.*, r.title, r.budget, r.status as requirement_status,
        u.first_name, u.last_name, u.email
      FROM bids b
      JOIN requirements r ON b.requirement_id = r.id
      JOIN users u ON r.customer_id = u.id
      WHERE b.shop_id = ?
      ORDER BY b.created_at DESC
    `, [shops[0].id]);

    res.json({
      success: true,
      bids
    });
  } catch (error) {
    console.error('My bids fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your bids' 
    });
  }
});

// Accept/Reject bid
router.put('/:id/status', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const { status } = req.body;
    const db = getDB();

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    // Get bid details and verify ownership
    const [bids] = await db.execute(`
      SELECT b.*, r.customer_id, s.user_id as shop_owner_id, s.shop_name
      FROM bids b
      JOIN requirements r ON b.requirement_id = r.id
      JOIN shops s ON b.shop_id = s.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (bids.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bid not found' 
      });
    }

    const bid = bids[0];

    if (bid.customer_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // Update bid status
    await db.execute(
      'UPDATE bids SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    // If accepted, mark requirement as fulfilled and reject other bids
    if (status === 'accepted') {
      await db.execute(
        'UPDATE requirements SET status = "fulfilled" WHERE id = ?',
        [bid.requirement_id]
      );

      await db.execute(
        'UPDATE bids SET status = "rejected" WHERE requirement_id = ? AND id != ?',
        [bid.requirement_id, req.params.id]
      );
    }

    // Notify shop owner
    const notificationMessage = status === 'accepted' 
      ? `Your bid of LKR ${bid.price.toLocaleString()} has been accepted!`
      : 'Your bid has been rejected';

    const notification = {
      user_id: bid.shop_owner_id,
      title: status === 'accepted' ? 'Bid Accepted!' : 'Bid Rejected',
      message: notificationMessage,
      type: `bid_${status}`,
      related_id: bid.id
    };

    await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, related_id) VALUES (?, ?, ?, ?, ?)',
      [notification.user_id, notification.title, notification.message, notification.type, notification.related_id]
    );

    // Send real-time notification
    if (req.io) {
      sendNotification(req.io, bid.shop_owner_id, notification);
    }

    res.json({
      success: true,
      message: `Bid ${status} successfully`
    });
  } catch (error) {
    console.error('Bid status update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update bid status' 
    });
  }
});

export default router;
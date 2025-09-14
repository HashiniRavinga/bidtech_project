import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDB } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { sendNotification } from '../config/socket.js';

const router = express.Router();

// Create requirement
router.post('/', authenticateToken, requireRole(['customer']), [
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('budget').isFloat({ min: 0 }),
  body('tags').isArray(),
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

    const { title, description, budget, tags, expiryDate } = req.body;
    const db = getDB();

    const [result] = await db.execute(
      'INSERT INTO requirements (customer_id, title, description, budget, tags, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, budget, JSON.stringify(tags), expiryDate]
    );

    // Notify matching shops about new requirement
    const matchingShops = await findMatchingShops(tags);
    for (const shop of matchingShops) {
      const notification = {
        user_id: shop.user_id,
        title: 'New Matching Requirement',
        message: `A new requirement "${title}" matches your shop tags`,
        type: 'requirement_matched',
        related_id: result.insertId
      };

      await db.execute(
        'INSERT INTO notifications (user_id, title, message, type, related_id) VALUES (?, ?, ?, ?, ?)',
        [notification.user_id, notification.title, notification.message, notification.type, notification.related_id]
      );

      // Send real-time notification
      if (req.io) {
        sendNotification(req.io, shop.user_id, notification);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Requirement posted successfully',
      requirementId: result.insertId
    });
  } catch (error) {
    console.error('Requirement creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create requirement' 
    });
  }
});

// Get all active requirements
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [requirements] = await db.execute(`
      SELECT r.*, u.first_name, u.last_name, u.email 
      FROM requirements r 
      JOIN users u ON r.customer_id = u.id 
      WHERE r.status = 'active' AND r.expiry_date > NOW()
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      requirements
    });
  } catch (error) {
    console.error('Requirements fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch requirements' 
    });
  }
});

// Get customer's requirements
router.get('/my', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const db = getDB();
    const [requirements] = await db.execute(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM bids b WHERE b.requirement_id = r.id AND b.status = 'pending') as pending_bids
      FROM requirements r 
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      requirements
    });
  } catch (error) {
    console.error('My requirements fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your requirements' 
    });
  }
});

// Get requirement by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const [requirements] = await db.execute(`
      SELECT r.*, u.first_name, u.last_name, u.email 
      FROM requirements r 
      JOIN users u ON r.customer_id = u.id 
      WHERE r.id = ?
    `, [req.params.id]);

    if (requirements.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Requirement not found' 
      });
    }

    res.json({
      success: true,
      requirement: requirements[0]
    });
  } catch (error) {
    console.error('Requirement fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch requirement' 
    });
  }
});

// Update requirement status
router.put('/:id/status', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const { status } = req.body;
    const db = getDB();

    if (!['active', 'fulfilled', 'expired'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const [result] = await db.execute(
      'UPDATE requirements SET status = ? WHERE id = ? AND customer_id = ?',
      [status, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Requirement not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      message: 'Requirement status updated successfully'
    });
  } catch (error) {
    console.error('Requirement status update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update requirement status' 
    });
  }
});

// Helper function to find matching shops
const findMatchingShops = async (tags) => {
  const db = getDB();
  const [shops] = await db.execute(`
    SELECT user_id, tags FROM shops 
    WHERE verification_status = 'verified'
  `);

  return shops.filter(shop => {
    if (!shop.tags) return false;
    const shopTags = JSON.parse(shop.tags);
    return tags.some(tag => shopTags.includes(tag));
  });
};

export default router;
import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDB } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get shop profile
router.get('/profile', authenticateToken, requireRole(['shop_owner']), async (req, res) => {
  try {
    const db = getDB();
    const [shops] = await db.execute(
      'SELECT * FROM shops WHERE user_id = ?',
      [req.user.id]
    );

    if (shops.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shop not found' 
      });
    }

    res.json({
      success: true,
      shop: shops[0]
    });
  } catch (error) {
    console.error('Shop profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch shop profile' 
    });
  }
});

// Update shop profile
router.put('/profile', authenticateToken, requireRole(['shop_owner']), [
  body('shopName').trim().isLength({ min: 1 }),
  body('address').optional().trim(),
  body('tags').optional().isArray()
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

    const { shopName, address, tags } = req.body;
    const db = getDB();

    await db.execute(
      'UPDATE shops SET shop_name = ?, address = ?, tags = ? WHERE user_id = ?',
      [shopName, address || null, JSON.stringify(tags || []), req.user.id]
    );

    res.json({
      success: true,
      message: 'Shop profile updated successfully'
    });
  } catch (error) {
    console.error('Shop profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update shop profile' 
    });
  }
});

// Get all verified shops
router.get('/verified', async (req, res) => {
  try {
    const db = getDB();
    const [shops] = await db.execute(`
      SELECT s.*, u.email, u.phone 
      FROM shops s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.verification_status = 'verified'
      ORDER BY s.average_rating DESC, s.created_at DESC
    `);

    res.json({
      success: true,
      shops
    });
  } catch (error) {
    console.error('Shops fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch shops' 
    });
  }
});

// Get shop by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const [shops] = await db.execute(`
      SELECT s.*, u.email, u.phone 
      FROM shops s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ?
    `, [req.params.id]);

    if (shops.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shop not found' 
      });
    }

    res.json({
      success: true,
      shop: shops[0]
    });
  } catch (error) {
    console.error('Shop fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch shop' 
    });
  }
});

// Update shop verification status (admin only)
router.put('/:id/verification', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const db = getDB();

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification status' 
      });
    }

    await db.execute(
      'UPDATE shops SET verification_status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: 'Verification status updated successfully'
    });
  } catch (error) {
    console.error('Verification update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update verification status' 
    });
  }
});

export default router;
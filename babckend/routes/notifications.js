import express from 'express';
import { getDB } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch notifications' 
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const [result] = await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update notification' 
    });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Notifications update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update notifications' 
    });
  }
});

// Get unread notification count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const [result] = await db.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );

    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Unread count fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch unread count' 
    });
  }
});

export default router;
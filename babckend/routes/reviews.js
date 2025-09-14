import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDB } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import Review from '../models/Review.js';

const router = express.Router();

// Submit a review
router.post('/', authenticateToken, requireRole(['customer']), [
  body('bidId').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 })
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

    const { bidId, rating, comment } = req.body;
    const db = getDB();

    // Verify bid exists, is accepted, and belongs to customer
    const [bids] = await db.execute(`
      SELECT b.shop_id, r.customer_id, s.shop_name
      FROM bids b
      JOIN requirements r ON b.requirement_id = r.id
      JOIN shops s ON b.shop_id = s.id
      WHERE b.id = ? AND b.status = 'accepted' AND r.customer_id = ?
    `, [bidId, req.user.id]);

    if (bids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid bid or unauthorized' 
      });
    }

    const bid = bids[0];

    // Check if review already exists
    const existingReview = await Review.findOne({ 
      customerId: req.user.id, 
      bidId: bidId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this bid' 
      });
    }

    // Create review
    const review = new Review({
      customerId: req.user.id,
      shopId: bid.shop_id,
      bidId: bidId,
      rating: rating,
      comment: comment || '',
      customerName: `${req.user.first_name} ${req.user.last_name}`.trim() || 'Anonymous'
    });

    await review.save();

    // Update shop's average rating
    await updateShopRating(bid.shop_id);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit review' 
    });
  }
});

// Get reviews for a shop
router.get('/shop/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ shopId: parseInt(req.params.id) })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews' 
    });
  }
});

// Get customer's reviews
router.get('/my', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const reviews = await Review.find({ customerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('My reviews fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your reviews' 
    });
  }
});

// Helper function to update shop rating
const updateShopRating = async (shopId) => {
  try {
    const reviews = await Review.find({ shopId: shopId });
    
    if (reviews.length === 0) {
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(2);

    const db = getDB();
    await db.execute(
      'UPDATE shops SET average_rating = ?, total_reviews = ? WHERE id = ?',
      [averageRating, reviews.length, shopId]
    );
  } catch (error) {
    console.error('Error updating shop rating:', error);
  }
};

export default router;
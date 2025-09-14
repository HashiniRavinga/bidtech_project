import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true
  },
  shopId: {
    type: Number,
    required: true
  },
  bidId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  customerName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one review per customer per bid
reviewSchema.index({ customerId: 1, bidId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
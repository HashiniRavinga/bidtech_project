import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, User, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    orderId: ''
  });
  const [showAddReview, setShowAddReview] = useState(false);

  const { t } = useLanguage();
  const { user, isCustomer, isShopOwner } = useAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          rating: 5,
          comment: 'Excellent service! The laptop was exactly as described and arrived quickly.',
          customerName: 'John Doe',
          customerImage: null,
          shopName: 'TechMart Electronics',
          orderId: 'ORD001',
          createdAt: '2025-01-18',
          verified: true
        },
        {
          id: 2,
          rating: 4,
          comment: 'Good quality products, but delivery took a bit longer than expected.',
          customerName: 'Sarah Wilson',
          customerImage: null,
          shopName: 'Digital Paradise',
          orderId: 'ORD002',
          createdAt: '2025-01-15',
          verified: true
        },
        {
          id: 3,
          rating: 5,
          comment: 'Outstanding customer support and high-quality gaming setup!',
          customerName: 'Mike Johnson',
          customerImage: null,
          shopName: 'Gaming Zone',
          orderId: 'ORD003',
          createdAt: '2025-01-12',
          verified: true
        }
      ];
      
      setReviews(mockReviews);
      
      // Calculate average rating
      if (mockReviews.length > 0) {
        const avg = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
        setAverageRating(avg);
      }
      
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reviewToAdd = {
        id: Date.now(),
        rating: newReview.rating,
        comment: newReview.comment,
        customerName: user?.name || 'Anonymous',
        orderId: newReview.orderId || `ORD${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        verified: true
      };
      
      setReviews(prev => [reviewToAdd, ...prev]);
      setNewReview({ rating: 0, comment: '', orderId: '' });
      setShowAddReview(false);
      toast.success('Review added successfully!');
      
      // Recalculate average
      const newReviews = [reviewToAdd, ...reviews];
      const avg = newReviews.reduce((sum, review) => sum + review.rating, 0) / newReviews.length;
      setAverageRating(avg);
      
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  const StarRating = ({ rating, size = 'h-5 w-5', interactive = false, onStarClick = null }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onStarClick?.(star) : undefined}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{review.customerName}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {review.verified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Verified
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Store className="h-4 w-4" />
              <span>{review.shopName}</span>
            </div>
            <span>Order: {review.orderId}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('reviews')}
          </h1>
          <p className="text-gray-600">Customer feedback and ratings</p>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={Math.round(averageRating)} size="h-6 w-6" />
                  <p className="text-sm text-gray-500 mt-1">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>
            </div>
            
            {isCustomer() && (
              <button
                onClick={() => setShowAddReview(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto md:mx-0"
              >
                <MessageSquare className="h-5 w-5" />
                <span>{t('addReview')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('addReview')}
              </h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('rating')} <span className="text-red-500">*</span>
                  </label>
                  <StarRating
                    rating={newReview.rating}
                    size="h-8 w-8"
                    interactive={true}
                    onStarClick={handleStarClick}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={newReview.orderId}
                    onChange={(e) => setNewReview(prev => ({ ...prev, orderId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter order ID (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reviewText')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    {t('submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500">
                Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
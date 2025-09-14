import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, DollarSign, Shield, FileText, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const BidSubmission = () => {
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [bidData, setBidData] = useState({
    price: '',
    warranty: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingRequirements, setLoadingRequirements] = useState(true);

  const { t } = useLanguage();
  const { isAuthenticated, isShopOwner } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated() || !isShopOwner()) {
      navigate('/login');
    } else {
      loadRequirements();
    }
  }, [isAuthenticated, isShopOwner, navigate]);

  const loadRequirements = async () => {
    setLoadingRequirements(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock requirements data
      setRequirements([
        {
          id: 1,
          title: 'Gaming Laptop Required',
          description: 'Looking for a high-performance gaming laptop with RTX 4060 or better, 16GB RAM, SSD storage',
          budget: '150000',
          tags: ['Laptop', 'Gaming', 'RAM'],
          customerName: 'John Doe',
          location: 'Colombo',
          postedAt: '2025-01-20',
          expiresAt: '2025-01-25',
          status: 'active'
        },
        {
          id: 2,
          title: 'Office Desktop Setup',
          description: 'Complete desktop setup for office work including monitor, keyboard, mouse',
          budget: '80000',
          tags: ['Desktop', 'Monitor', 'Keyboard', 'Mouse'],
          customerName: 'Sarah Wilson',
          location: 'Kandy',
          postedAt: '2025-01-19',
          expiresAt: '2025-01-24',
          status: 'active'
        },
        {
          id: 3,
          title: 'Professional Camera',
          description: 'DSLR camera for professional photography with multiple lenses',
          budget: '200000',
          tags: ['Camera', 'Photography', 'Accessories'],
          customerName: 'Mike Johnson',
          location: 'Galle',
          postedAt: '2025-01-18',
          expiresAt: '2025-01-23',
          status: 'active'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load requirements');
    } finally {
      setLoadingRequirements(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRequirement) {
      toast.error('Please select a requirement first');
      return;
    }

    if (parseFloat(bidData.price) > parseFloat(selectedRequirement.budget)) {
      toast.error('Bid price cannot exceed the customer budget');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Bid submitted successfully!');
      setSelectedRequirement(null);
      setBidData({ price: '', warranty: '', message: '' });
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidDataChange = (e) => {
    const { name, value } = e.target;
    setBidData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const RequirementCard = ({ requirement, onSelect }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 card-hover cursor-pointer transition-all duration-200 ${
        selectedRequirement?.id === requirement.id 
          ? 'ring-2 ring-blue-500 border-blue-500' 
          : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(requirement)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          {requirement.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{requirement.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {requirement.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-bold text-green-600">Budget: LKR {requirement.budget}</p>
        <p className="text-sm text-gray-500">{requirement.location}</p>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>Customer: {requirement.customerName}</p>
        <p>Expires: {new Date(requirement.expiresAt).toLocaleDateString()}</p>
      </div>
    </div>
  );

  const BidForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Submit Bid for: {selectedRequirement.title}
      </h3>
      
      <form onSubmit={handleBidSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('bidPrice')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="price"
              value={bidData.price}
              onChange={handleBidDataChange}
              required
              max={selectedRequirement.budget}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your bid price"
            />
          </div>
          <p className="text-xs text-gray-500">
            Maximum: LKR {selectedRequirement.budget}
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('warranty')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="warranty"
              value={bidData.warranty}
              onChange={handleBidDataChange}
              required
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="e.g., 2 years manufacturer warranty"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('message')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="message"
              value={bidData.message}
              onChange={handleBidDataChange}
              required
              rows={4}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
              placeholder="Describe your product, specifications, and why the customer should choose you..."
            />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Bidding Guidelines:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Your bid will be private and visible only to the customer</li>
            <li>• Be competitive but realistic with your pricing</li>
            <li>• Clearly mention product specifications and warranty</li>
            <li>• Customer can accept or reject your bid</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setSelectedRequirement(null)}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>{t('loading')}</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5" />
                <span>{t('submitBid')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (loadingRequirements) {
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Available Requirements
          </h2>
          <p className="text-gray-600">
            Browse and submit bids for customer requirements matching your products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requirements List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Open Requirements ({requirements.length})
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {requirements.map(requirement => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  onSelect={setSelectedRequirement}
                />
              ))}
            </div>
          </div>

          {/* Bid Form */}
          <div className="lg:col-span-1">
            {selectedRequirement ? (
              <BidForm />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Requirement
                  </h3>
                  <p className="text-gray-500">
                    Click on a requirement from the list to submit your bid
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidSubmission;
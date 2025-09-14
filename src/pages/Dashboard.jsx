import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  MessageSquare, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isCustomer, isShopOwner } = useAuth();
  const { t } = useLanguage();
  const [requirements, setRequirements] = useState([]);
  const [bids, setBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isCustomer()) {
        // Mock customer data
        setRequirements([
          {
            id: 1,
            title: 'Gaming Laptop Required',
            description: 'Looking for a high-performance gaming laptop',
            budget: '150000',
            tags: ['Laptop', 'Gaming', 'RAM'],
            status: 'active',
            bidCount: 3,
            createdAt: '2025-01-20'
          },
          {
            id: 2,
            title: 'Office Keyboard',
            description: 'Mechanical keyboard for office use',
            budget: '8000',
            tags: ['Keyboard', 'Office'],
            status: 'expired',
            bidCount: 1,
            createdAt: '2025-01-18'
          }
        ]);
        
        setBids([
          {
            id: 1,
            requirementId: 1,
            shopName: 'TechMart',
            price: '145000',
            warranty: '2 years',
            message: 'Best quality gaming laptop with RTX 4060',
            status: 'pending',
            createdAt: '2025-01-20'
          }
        ]);
      } else {
        // Mock shop owner data
        setRequirements([
          {
            id: 1,
            title: 'Gaming Laptop Required',
            description: 'Looking for a high-performance gaming laptop',
            budget: '150000',
            tags: ['Laptop', 'Gaming', 'RAM'],
            customerName: 'John Doe',
            location: 'Colombo',
            postedAt: '2025-01-20'
          }
        ]);
        
        setBids([
          {
            id: 1,
            requirementTitle: 'Gaming Laptop Required',
            price: '145000',
            warranty: '2 years',
            status: 'pending',
            submittedAt: '2025-01-20'
          }
        ]);
      }
      
      setNotifications([
        {
          id: 1,
          type: 'bid_received',
          message: 'New bid received for Gaming Laptop',
          time: '5 minutes ago',
          unread: true
        },
        {
          id: 2,
          type: 'requirement_matched',
          message: 'New requirement matches your shop tags',
          time: '1 hour ago',
          unread: false
        }
      ]);
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const RequirementCard = ({ requirement }) => (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          requirement.status === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {requirement.status}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{requirement.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {requirement.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-green-600">LKR {requirement.budget}</p>
        {isCustomer() && (
          <p className="text-sm text-gray-500">{requirement.bidCount} bids</p>
        )}
      </div>
    </div>
  );

  const BidCard = ({ bid }) => (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isCustomer() ? bid.shopName : bid.requirementTitle}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          bid.status === 'pending' 
            ? 'bg-yellow-100 text-yellow-800'
            : bid.status === 'accepted'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {bid.status}
        </span>
      </div>
      {isCustomer() && bid.message && (
        <p className="text-gray-600 mb-4">{bid.message}</p>
      )}
      <div className="space-y-2 mb-4">
        <p className="text-lg font-bold text-blue-600">LKR {bid.price}</p>
        <p className="text-sm text-gray-500">Warranty: {bid.warranty}</p>
      </div>
      {isCustomer() && bid.status === 'pending' && (
        <div className="flex space-x-2">
          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
            Accept
          </button>
          <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200">
            Reject
          </button>
        </div>
      )}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isCustomer() ? (
            <>
              <StatCard
                icon={Package}
                title={t('myRequirements')}
                value={requirements.length}
                color="blue"
              />
              <StatCard
                icon={MessageSquare}
                title={t('receivedBids')}
                value={bids.length}
                color="green"
              />
              <StatCard
                icon={Bell}
                title={t('notifications')}
                value={notifications.filter(n => n.unread).length}
                color="yellow"
              />
              <StatCard
                icon={CheckCircle}
                title="Active Requirements"
                value={requirements.filter(r => r.status === 'active').length}
                color="indigo"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={Package}
                title={t('openRequirements')}
                value={requirements.length}
                color="blue"
              />
              <StatCard
                icon={MessageSquare}
                title={t('submittedBids')}
                value={bids.length}
                color="green"
              />
              <StatCard
                icon={Star}
                title="Shop Rating"
                value="4.8"
                color="yellow"
              />
              <StatCard
                icon={CheckCircle}
                title={t('verificationStatus')}
                value="Verified"
                color="indigo"
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {isCustomer() ? (
            <Link
              to="/post-requirement"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>{t('postRequirement')}</span>
            </Link>
          ) : (
            <Link
              to="/bid-submission"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>View Requirements</span>
            </Link>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requirements/Bids Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isCustomer() ? t('myRequirements') : t('openRequirements')}
                </h2>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {requirements.map(requirement => (
                  <RequirementCard key={requirement.id} requirement={requirement} />
                ))}
              </div>
            </div>

            {/* Bids Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {isCustomer() ? t('receivedBids') : t('submittedBids')}
              </h2>
              <div className="space-y-4">
                {bids.map(bid => (
                  <BidCard key={bid.id} bid={bid} />
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {t('notifications')}
              </h2>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Store, Star, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { t } = useLanguage();
  const { user, isCustomer, isShopOwner } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock profile data
      const mockProfile = {
        id: user?.id || 1,
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+94 77 123 4567',
        address: isShopOwner() ? '123 Main Street, Colombo' : 'Apartment 4B, Kandy Road, Kandy',
        role: user?.role || 'customer',
        verified: true,
        joinedAt: '2024-12-01',
        ...(isShopOwner() && {
          businessType: 'Electronics Store',
          businessLicense: 'BL12345',
          rating: 4.8,
          totalReviews: 156,
          totalSales: 234
        }),
        ...(isCustomer() && {
          totalRequirements: 12,
          activeRequirements: 3,
          completedPurchases: 8
        })
      };
      
      setProfile(mockProfile);
      setFormData(mockProfile);
      
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(formData);
      setEditing(false);
      toast.success('Profile updated successfully!');
      
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ProfileField = ({ icon: Icon, label, name, value, editable = true, type = 'text' }) => (
    <div className="flex items-center space-x-3 py-3">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        {editing && editable ? (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <p className="text-gray-900">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  const StatCard = ({ label, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg p-6 shadow-md text-center">
      <p className={`text-3xl font-bold text-${color}-600 mb-2`}>{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {isShopOwner() ? (
                  <Store className="h-10 w-10 text-blue-600" />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {profile.role.replace('_', ' ')}
                  </span>
                </div>
                {isShopOwner() && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-700">
                      {profile.rating} ({profile.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                    <span>{t('cancel')}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="spinner"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{t('save')}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  <span>{t('edit')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Profile Information
              </h2>
              
              <div className="space-y-2">
                <ProfileField
                  icon={isShopOwner() ? Store : User}
                  label={isShopOwner() ? 'Shop Name' : 'Full Name'}
                  name="name"
                  value={profile.name}
                />
                <ProfileField
                  icon={Mail}
                  label="Email"
                  name="email"
                  value={profile.email}
                  type="email"
                />
                <ProfileField
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  type="tel"
                />
                <ProfileField
                  icon={MapPin}
                  label="Address"
                  name="address"
                  value={profile.address}
                />
                
                {isShopOwner() && (
                  <>
                    <ProfileField
                      icon={Store}
                      label="Business Type"
                      name="businessType"
                      value={profile.businessType}
                    />
                    <ProfileField
                      icon={Store}
                      label="Business License"
                      name="businessLicense"
                      value={profile.businessLicense}
                      editable={false}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Stats
                </h3>
                
                {isShopOwner() ? (
                  <div className="space-y-4">
                    <StatCard
                      label="Total Sales"
                      value={profile.totalSales}
                      color="green"
                    />
                    <StatCard
                      label="Reviews"
                      value={profile.totalReviews}
                      color="yellow"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <StatCard
                      label="Total Requirements"
                      value={profile.totalRequirements}
                      color="blue"
                    />
                    <StatCard
                      label="Active Requirements"
                      value={profile.activeRequirements}
                      color="green"
                    />
                    <StatCard
                      label="Completed Purchases"
                      value={profile.completedPurchases}
                      color="indigo"
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joined:</span>
                    <span className="text-gray-900">
                      {new Date(profile.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      profile.verified ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {profile.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Type:</span>
                    <span className="text-gray-900 capitalize">
                      {profile.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
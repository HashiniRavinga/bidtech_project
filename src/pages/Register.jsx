import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Store, Mail, Phone, Lock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    accountType: 'customer',
    firstName: '',
    lastName: '',
    shopName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const userData = {
        id: Date.now(),
        email: formData.email,
        name: formData.accountType === 'customer' 
          ? `${formData.firstName} ${formData.lastName}`
          : formData.shopName,
        role: formData.accountType === 'customer' ? 'customer' : 'shop_owner',
        verified: false
      };
      
      const mockToken = 'mock-jwt-token';
      login(userData, mockToken);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    name, 
    type = 'text', 
    required = true,
    showToggle = false,
    show = false,
    onToggle = null 
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showToggle ? (show ? 'text' : 'password') : type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder={label}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {show ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('register')}
            </h2>
            <p className="text-gray-600">Create your BidTech account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('accountType')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'customer' }))}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.accountType === 'customer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{t('customer')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'shop_owner' }))}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.accountType === 'shop_owner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Store className="h-5 w-5" />
                  <span className="font-medium">{t('shopOwner')}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Fields based on Account Type */}
            {formData.accountType === 'customer' ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon={User}
                  label={t('firstName')}
                  name="firstName"
                />
                <InputField
                  icon={User}
                  label={t('lastName')}
                  name="lastName"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <InputField
                  icon={Store}
                  label={t('shopName')}
                  name="shopName"
                />
                <InputField
                  icon={MapPin}
                  label={t('address')}
                  name="address"
                />
              </div>
            )}

            <div className="space-y-4">
              <InputField
                icon={Mail}
                label={t('email')}
                name="email"
                type="email"
              />
              <InputField
                icon={Phone}
                label={t('phone')}
                name="phone"
                type="tel"
              />
            </div>

            <div className="space-y-4">
              <InputField
                icon={Lock}
                label={t('password')}
                name="password"
                showToggle={true}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
              <InputField
                icon={Lock}
                label={t('confirmPassword')}
                name="confirmPassword"
                showToggle={true}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <span>{t('submit')}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
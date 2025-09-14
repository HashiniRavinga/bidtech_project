import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const PostRequirement = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    selectedTags: [],
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  const availableTags = [
    'Laptop', 'Desktop', 'Mobile', 'Tablet', 'Gaming', 
    'RAM', 'Storage', 'Graphics Card', 'Processor', 
    'Keyboard', 'Mouse', 'Monitor', 'Headphones', 
    'Webcam', 'Printer', 'Software', 'Accessories'
  ];

  React.useEffect(() => {
    if (!isAuthenticated() || !isCustomer()) {
      navigate('/login');
    }
  }, [isAuthenticated, isCustomer, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.selectedTags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    if (!formData.expiryDate) {
      toast.error('Please select an expiry date');
      return;
    }

    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();
    if (expiryDate <= today) {
      toast.error('Expiry date must be in the future');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Requirement posted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Failed to post requirement. Please try again.');
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
    placeholder = '',
    multiline = false
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
        {multiline ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            rows={4}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('postRequirement')}
            </h2>
            <p className="text-gray-600">Tell sellers what you're looking for</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={Package}
              label={t('title')}
              name="title"
              placeholder="e.g., Gaming Laptop Required"
            />

            <InputField
              icon={FileText}
              label={t('description')}
              name="description"
              placeholder="Provide detailed description of what you need..."
              multiline={true}
            />

            <InputField
              icon={DollarSign}
              label={t('budget')}
              name="budget"
              type="number"
              placeholder="Enter your budget in LKR"
            />

            <InputField
              icon={Calendar}
              label={t('expiryDate')}
              name="expiryDate"
              type="datetime-local"
            />

            {/* Tags Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('tags')} <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500">
                Select relevant tags to help sellers find your requirement
              </p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="inline h-4 w-4 mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
              {formData.selectedTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your requirement will be visible to verified sellers only</li>
                <li>• Sellers will submit private bids that only you can see</li>
                <li>• You can accept or reject bids at any time</li>
                <li>• Requirements expire automatically on the selected date</li>
              </ul>
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
                <>
                  <Package className="h-5 w-5" />
                  <span>{t('postRequirement')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRequirement;
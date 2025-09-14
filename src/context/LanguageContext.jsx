import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    
    // Home page
    heroTitle: 'Connect Buyers & Sellers',
    heroSubtitle: 'The trusted platform for product requirements and competitive bidding in Sri Lanka',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    features: 'Features',
    
    // Features
    secureAuth: 'Secure Authentication',
    secureAuthDesc: 'JWT-based secure login for customers and shop owners with role-based access control',
    profileMgmt: 'Profile Management',
    profileMgmtDesc: 'Complete profile management with business verification for shop owners',
    productReq: 'Product Requirements',
    productReqDesc: 'Post detailed product requirements with budget and tag-based categorization',
    privateBidding: 'Private Bidding',
    privateBiddingDesc: 'Secure private bidding system with expiration dates and real-time notifications',
    realTimeNotif: 'Real-time Notifications',
    realTimeNotifDesc: 'Instant notifications for bids, acceptance, and important updates',
    reviewSystem: 'Review & Rating System',
    reviewSystemDesc: 'Comprehensive rating system to build trust between buyers and sellers',
    tagMatching: 'Smart Tag Matching',
    tagMatchingDesc: 'Intelligent matching system to connect buyers with relevant sellers',
    multiLang: 'Multi-language Support',
    multiLangDesc: 'Available in both English and Sinhala for better accessibility',
    
    // Forms
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    shopName: 'Shop Name',
    address: 'Address',
    accountType: 'Account Type',
    customer: 'Customer',
    shopOwner: 'Shop Owner',
    submit: 'Submit',
    
    // Footer
    copyright: '© 2025 BidTech. All rights reserved.',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Dashboard
    myRequirements: 'My Requirements',
    receivedBids: 'Received Bids',
    notifications: 'Notifications',
    openRequirements: 'Open Requirements',
    submittedBids: 'Submitted Bids',
    verificationStatus: 'Verification Status',
    
    // Requirements
    postRequirement: 'Post Requirement',
    title: 'Title',
    description: 'Description',
    budget: 'Budget (LKR)',
    tags: 'Tags',
    expiryDate: 'Expiry Date',
    
    // Bidding
    submitBid: 'Submit Bid',
    bidPrice: 'Bid Price (LKR)',
    warranty: 'Warranty Details',
    message: 'Message',
    
    // Reviews
    addReview: 'Add Review',
    rating: 'Rating',
    reviewText: 'Review Text',
    reviews: 'Reviews'
  },
  si: {
    // Navigation
    home: 'මුල් පිටුව',
    login: 'ඇතුළු වන්න',
    register: 'ලියාපදිංචි වන්න',
    dashboard: 'පාලක පුවරුව',
    profile: 'පැතිකඩ',
    logout: 'ඉවත් වන්න',
    
    // Home page
    heroTitle: 'ගැනුම්කරුවන් සහ විකුණුම්කරුවන් සම්බන්ධ කරන්න',
    heroSubtitle: 'ශ්‍රී ලංකාවේ නිෂ්පාදන අවශ්‍යතා සහ තරඟකාරී ලංසු තැබීම සඳහා විශ්වාසදායක වේදිකාව',
    getStarted: 'ආරම්භ කරන්න',
    learnMore: 'තව දැනගන්න',
    features: 'විශේෂාංග',
    
    // Features
    secureAuth: 'ආරක්ෂිත සත්‍යාපනය',
    secureAuthDesc: 'JWT-පාදක ආරක්ෂිත ප්‍රවේශය සහ භූමිකා-පාදක ප්‍රවේශ පාලනය',
    profileMgmt: 'පැතිකඩ කළමනාකරණය',
    profileMgmtDesc: 'සාප්පු හිමියන් සඳහා ව්‍යාපාරික සත්‍යාපනය සමඟ සම්පූර්ණ පැතිකඩ කළමනාකරණය',
    productReq: 'නිෂ්පාදන අවශ්‍යතා',
    productReqDesc: 'අයවැය සහ ටැග් පදනම් වූ වර්ගීකරණය සමඟ සවිස්තරාත්මක නිෂ්පාදන අවශ්‍යතා පළ කරන්න',
    privateBidding: 'පුද්ගලික ලංසු තැබීම',
    privateBiddingDesc: 'කල්ඔත්තීරි දින සහ තත්කාලීන දැනුම්දීම් සමඟ ආරක්ෂිත පුද්ගලික ලංසු තැබීමේ ක්‍රමය',
    realTimeNotif: 'තත්කාලීන දැනුම්දීම්',
    realTimeNotifDesc: 'ලංසු, පිළිගැනීම් සහ වැදගත් යාවත්කාලීන කිරීම් සඳහා ක්ෂණික දැනුම්දීම්',
    reviewSystem: 'සමාලෝචන සහ ශ්‍රේණිගත කිරීමේ ක්‍රමය',
    reviewSystemDesc: 'ගනුදෙනුකරුවන් සහ විකුණුම්කරුවන් අතර විශ්වාසය ගොඩනැගීමට සවිස්තරාත්මක ශ්‍රේණිගත කිරීමේ ක්‍රමය',
    tagMatching: 'ස්මාර්ට් ටැග් ගැලපීම',
    tagMatchingDesc: 'ගනුදෙනුකරුවන් අදාළ විකුණුම්කරුවන් සමඟ සම්බන්ධ කිරීමට බුද්ධිමත් ගැලපීමේ ක්‍රමය',
    multiLang: 'බහු භාෂා සහාය',
    multiLangDesc: 'හොඳ ප්‍රවේශ්‍යතාවක් සඳහා ඉංග්‍රීසි සහ සිංහල යන භාෂා දෙකෙන්ම ලබා ගත හැක',
    
    // Forms
    email: 'විද්‍යුත් ලිපිනය',
    password: 'මුරපදය',
    confirmPassword: 'මුරපදය තහවුරු කරන්න',
    firstName: 'මුල් නම',
    lastName: 'අවසාන නම',
    phone: 'දුරකථන',
    shopName: 'සාප්පු නම',
    address: 'ලිපිනය',
    accountType: 'ගිණුම් වර්ගය',
    customer: 'පාරිභෝගිකයා',
    shopOwner: 'සාප්පු හිමියා',
    submit: 'ඉදිරිපත් කරන්න',
    
    // Footer
    copyright: '© 2025 BidTech. සියලුම හිමිකම් ඇවිරිණි.',
    
    // Common
    loading: 'පූරණය වෙමින්...',
    save: 'සුරකින්න',
    cancel: 'අවලංගු කරන්න',
    edit: 'සංස්කරණය කරන්න',
    delete: 'මකන්න',
    search: 'සොයන්න',
    filter: 'පෙරන්න',
    sort: 'වර්ග කරන්න',
    
    // Dashboard
    myRequirements: 'මගේ අවශ්‍යතා',
    receivedBids: 'ලැබුණු ලංසු',
    notifications: 'දැනුම්දීම්',
    openRequirements: 'විවෘත අවශ්‍යතා',
    submittedBids: 'ඉදිරිපත් කළ ලංසු',
    verificationStatus: 'සත්‍යාපන තත්ත්වය',
    
    // Requirements
    postRequirement: 'අවශ්‍යතාවය පළ කරන්න',
    title: 'මාතෘකාව',
    description: 'විස්තරය',
    budget: 'අයවැය (රු.)',
    tags: 'ටැග්',
    expiryDate: 'කල්ඔත්තීරි දිනය',
    
    // Bidding
    submitBid: 'ලංසුව ඉදිරිපත් කරන්න',
    bidPrice: 'ලංසු මිල (රු.)',
    warranty: 'වගකීමේ විස්තර',
    message: 'පණිවිඩය',
    
    // Reviews
    addReview: 'සමාලෝචනයක් එක් කරන්න',
    rating: 'ශ්‍රේණිගත කිරීම',
    reviewText: 'සමාලෝචන පෙළ',
    reviews: 'සමාලෝචන'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'si')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'si' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
  };

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
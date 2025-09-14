import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogOut, User, Home, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      } ${className}`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BidTech</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">
              <div className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>{t('home')}</span>
              </div>
            </NavLink>

            {isAuthenticated() ? (
              <>
                <NavLink to="/dashboard">{t('dashboard')}</NavLink>
                <NavLink to="/profile">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{t('profile')}</span>
                  </div>
                </NavLink>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">{t('login')}</NavLink>
                <NavLink to="/register" className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white">
                  {t('register')}
                </NavLink>
              </>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Toggle Language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentLanguage === 'en' ? 'සිං' : 'EN'}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              title="Toggle Language"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <NavLink to="/" className="block">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>{t('home')}</span>
              </div>
            </NavLink>

            {isAuthenticated() ? (
              <>
                <NavLink to="/dashboard" className="block">{t('dashboard')}</NavLink>
                <NavLink to="/profile" className="block">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{t('profile')}</span>
                  </div>
                </NavLink>
                <div className="px-3 py-2 bg-gray-100 rounded-md mx-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md mx-2 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="block">{t('login')}</NavLink>
                <NavLink to="/register" className="block bg-blue-600 text-white hover:bg-blue-700">
                  {t('register')}
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
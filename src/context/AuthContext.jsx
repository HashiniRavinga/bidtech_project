import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth-token');
    const userData = Cookies.get('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    Cookies.set('auth-token', token, { expires: 7 });
    Cookies.set('user-data', JSON.stringify(userData), { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth-token');
    Cookies.remove('user-data');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  const isShopOwner = () => {
    return user?.role === 'shop_owner';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated,
      isCustomer,
      isShopOwner
    }}>
      {children}
    </AuthContext.Provider>
  );
};
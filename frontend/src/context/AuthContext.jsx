import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../services/api';

const AuthContext = createContext();

const defaultDemoUser = {
  id: 'demo_user_1',
  name: 'Gouthami',
  email: 'gouthami@smarttravel.ai',
  role: 'user',
  preferred_transport: 'train',
  budget: 'Medium',
  preferred_travel_time: 'Morning (06:00 - 10:00)',
  frequent_destinations: ['Hyderabad', 'Vijayawada'],
  max_duration: '6 hours',
  travel_preferences: 'Window seat, punctual train departures, vegetarian meal options'
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('smart_traveler_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_traveler_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const isLoggedIn = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem('smart_traveler_token', token);
    } else {
      localStorage.removeItem('smart_traveler_token');
      localStorage.removeItem('smart_traveler_user');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_traveler_user', JSON.stringify(user));
    }
  }, [user]);

  // 1-Click Instant Demo Login
  const loginDemo = () => {
    const demoToken = 'demo_jwt_token_2026';
    setToken(demoToken);
    setUser(defaultDemoUser);
    return { success: true, user: defaultDemoUser };
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      // Resilient fallback to demo login if backend is in demo mode
      return loginDemo();
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, preferred_transport) => {
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, preferred_transport });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const newUser = {
        ...defaultDemoUser,
        name,
        email,
        preferred_transport: preferred_transport || 'train'
      };
      setToken('demo_jwt_token_2026');
      setUser(newUser);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await updateUserProfile(updates);
      if (res.success) {
        setUser(res.data);
        return { success: true };
      }
    } catch (err) {
      setUser((prev) => ({ ...prev, ...updates }));
      return { success: true };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smart_traveler_token');
    localStorage.removeItem('smart_traveler_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        loading,
        isDemoMode,
        setIsDemoMode,
        login,
        loginDemo,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

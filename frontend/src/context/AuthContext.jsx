import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${API_BASE_URL}/api/auth`;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`);
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/register`, userData);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/logout`);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '@/config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/api/auth/me');
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/api/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    setUser(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await API.post('/api/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await API.get('/api/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

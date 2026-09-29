import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (data: { name: string; email: string; phone: string; password: string; address?: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pon_bakery_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pon_bakery_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('pon_bakery_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await api.auth.login(identifier, pass);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('pon_bakery_token', res.token);
        localStorage.setItem('pon_bakery_user', JSON.stringify(res.user));
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login error' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string; address?: string }) => {
    try {
      const res = await api.auth.register(data);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('pon_bakery_token', res.token);
        localStorage.setItem('pon_bakery_user', JSON.stringify(res.user));
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pon_bakery_token');
    localStorage.removeItem('pon_bakery_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const next = { ...user, ...updatedData };
      setUser(next);
      localStorage.setItem('pon_bakery_user', JSON.stringify(next));
    }
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

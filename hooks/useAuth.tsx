import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Conditionally import session management based on the platform
let session;
if (Platform.OS === 'web') {
  session = require('../lib/session.web');
} else {
  session = require('../lib/session');
}

const { getToken, clearToken, setToken } = session;

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    await setToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/pizzaBoxApi';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string, user: any) => void;
  signOut: () => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on boot
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Verify token or get user profile
          const response = await api.get('/auth/me');
          setUser(response.data);
          setUserToken(token);
        }
      } catch (e) {
        // Restoring token failed (token might be invalid)
        await AsyncStorage.removeItem('userToken');
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const signIn = async (token: string, userData: any) => {
    setUserToken(token);
    setUser(userData);
    await AsyncStorage.setItem('userToken', token);
  };

  const signOut = async () => {
    setUserToken(null);
    setUser(null);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut, user }}>
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

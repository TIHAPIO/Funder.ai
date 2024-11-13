'use client';

import { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user for testing
const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
  getIdToken: () => Promise.resolve('mock-token'),
} as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with mock user for testing
  const [user] = useState<User | null>(mockUser);
  const [loading] = useState(false);

  const login = async () => {
    console.log('Mock login');
  };

  const signup = async () => {
    console.log('Mock signup');
  };

  const logout = async () => {
    console.log('Mock logout');
  };

  const resetPassword = async () => {
    console.log('Mock reset password');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

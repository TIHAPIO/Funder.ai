'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebase';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // If user is logged in, get the ID token and set session cookie
      if (user) {
        const idToken = await user.getIdToken();
        // Set session cookie
        document.cookie = `session=${idToken}; path=/;`;
      } else {
        // Clear session cookie when logged out
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    });

    return () => unsubscribe();
  }, []);

  const getAuthErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/invalid-credential':
        return 'Invalid credentials';
      default:
        return error.message || 'An authentication error occurred';
    }
  };

  const handleAuthError = (error: unknown): never => {
    if (error instanceof FirebaseError) {
      const errorMessage = getAuthErrorMessage(error);
      console.error('Firebase Auth Error:', {
        code: error.code,
        message: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    if (error instanceof Error) {
      console.error('Auth Error:', error.message);
      throw error;
    }
    
    console.error('Unknown Auth Error:', error);
    throw new Error('An unexpected authentication error occurred');
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get the ID token right after login
      const idToken = await userCredential.user.getIdToken();
      // Set session cookie
      document.cookie = `session=${idToken}; path=/;`;
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (!email || !password || !displayName) {
      throw new Error('Email, password, and display name are required');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        // Get the ID token right after signup
        const idToken = await userCredential.user.getIdToken();
        // Set session cookie
        document.cookie = `session=${idToken}; path=/;`;
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear session cookie
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (error) {
      handleAuthError(error);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email) {
      throw new Error('Email is required');
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

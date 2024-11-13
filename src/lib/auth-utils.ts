'use client';

import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getCookie } from 'cookies-next';

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = getCookie('firebaseToken');
  const user = await getCurrentUser();
  return !!token && !!user;
};

export const getAuthToken = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.getIdToken();
};

export const validateAuthState = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
};

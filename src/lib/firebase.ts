'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBScUlM4gUkqalVon7wBDdk4jUql0_HS2A",
  authDomain: "fundr-f7a05.firebaseapp.com",
  projectId: "fundr-f7a05",
  storageBucket: "fundr-f7a05.firebasestorage.app",
  messagingSenderId: "545555379224",
  appId: "1:545555379224:web:f8cd46d380fc547da13f6d",
  measurementId: "G-T0Y5YR6CBS"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  try {
    // Initialize Firebase only on the client side
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      // Only initialize analytics if window is defined (client-side)
      if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
      }
    } else {
      app = getApps()[0];
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw new Error('Failed to initialize Firebase. Please check your configuration.');
  }
} else {
  // Server-side initialization with empty app
  app = {} as FirebaseApp;
}

// Initialize Firebase services with error handling
const auth = typeof window !== 'undefined' 
  ? (() => {
      try {
        const authInstance = getAuth(app);
        // Uncomment the following line if you want to use Firebase Auth Emulator
        // if (process.env.NODE_ENV === 'development') {
        //   connectAuthEmulator(authInstance, 'http://localhost:9099');
        // }
        return authInstance;
      } catch (error) {
        console.error('Error initializing Firebase Auth:', error);
        throw new Error('Failed to initialize Firebase Authentication.');
      }
    })()
  : ({} as ReturnType<typeof getAuth>);

const db = typeof window !== 'undefined'
  ? (() => {
      try {
        return getFirestore(app);
      } catch (error) {
        console.error('Error initializing Firestore:', error);
        throw new Error('Failed to initialize Firestore.');
      }
    })()
  : ({} as ReturnType<typeof getFirestore>);

const storage = typeof window !== 'undefined'
  ? (() => {
      try {
        return getStorage(app);
      } catch (error) {
        console.error('Error initializing Firebase Storage:', error);
        throw new Error('Failed to initialize Firebase Storage.');
      }
    })()
  : ({} as ReturnType<typeof getStorage>);

export { app, analytics, auth, db, storage };

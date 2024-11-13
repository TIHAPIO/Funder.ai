'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBT--90PdI5xYIqNERqAJlgj3wxmU_V004",
  authDomain: "fundrai.firebaseapp.com",
  projectId: "fundrai",
  storageBucket: "fundrai.firebasestorage.app",
  messagingSenderId: "861398330786",
  appId: "1:861398330786:web:443f3849826d7c3e9896fb",
  measurementId: "G-RRNGPTMDTZ"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export { app, auth, db };

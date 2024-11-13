'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBT--90PdI5xYIqNERqAJlgj3wxmU_V004",
  authDomain: "fundrai.firebaseapp.com",
  projectId: "fundrai",
  storageBucket: "fundrai.firebasestorage.app",
  messagingSenderId: "861398330786",
  appId: "1:861398330786:web:443f3849826d7c3e9896fb",
  measurementId: "G-RRNGPTMDTZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

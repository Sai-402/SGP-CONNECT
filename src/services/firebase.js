// ============================================================================
// FIREBASE INITIALIZATION & CONFIGURATION VALIDATOR
// SGP Connect — Sanjay Gandhi Polytechnic Digital Campus
// ============================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDwc5eeI19slfcl95NivyLw2Cxy7WMr16M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sgp-connect-c97ab.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sgp-connect-c97ab",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sgp-connect-c97ab.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "191377775436",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:191377775436:web:5aa0002c9b39a652dfcde9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NZ308RYV9L"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize Analytics if supported in this environment
    if (typeof window !== 'undefined') {
      isAnalyticsSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics not supported in this environment
      });
    }

    console.info('%c[SGP Connect] 🔥 Firebase Live Fullstack connected:', 'color: #10B981; font-weight: bold;', firebaseConfig.projectId);
  } catch (error) {
    console.warn('[SGP Connect] Firebase initialization error. Falling back to offline sync:', error);
  }
} else {
  console.info('%c[SGP Connect] Running in Standalone Campus Mode.', 'color: #3B82F6; font-weight: bold;');
}

export { app, auth, db, storage, analytics, firebaseConfig };
export default app;


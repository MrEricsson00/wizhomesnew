
// Fix: Using namespace imports and destructuring to resolve false positive missing member errors
import * as FirebaseApp from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import * as FirebaseFirestore from 'firebase/firestore';
import * as FirebaseAnalytics from 'firebase/analytics';

// Extract members from namespaces to provide stable exports
const { initializeApp } = FirebaseApp as any;
const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signOut } = FirebaseAuth as any;
const { getFirestore, collection, doc, setDoc, getDoc } = FirebaseFirestore as any;
const { getAnalytics } = FirebaseAnalytics as any;

// Updated with the user's live Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoHmYi7qEjZFSms4gcOQMW3dbT4cKVowU",
  authDomain: "wiz-homes.firebaseapp.com",
  projectId: "wiz-homes",
  storageBucket: "wiz-homes.firebasestorage.app",
  messagingSenderId: "149137397345",
  appId: "1:149137397345:web:b4e44288b1fedad8b2fc20",
  measurementId: "G-4TZ0QH9QJR"
};

// Initialize Firebase with the modular SDK
const app = initializeApp(firebaseConfig);

// Export service instances and methods centralized in this module
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  collection,
  doc,
  setDoc,
  getDoc
};

export default app;

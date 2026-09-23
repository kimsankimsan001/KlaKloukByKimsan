/**
 * Firebase Configuration for Kla Klouk by Kimsan
 *
 * HOW TO CONNECT YOUR FIREBASE PROJECT:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select your project -> Project Settings (gear icon) -> General -> "Your apps" (Web </>).
 * 3. Copy the firebaseConfig keys and either:
 *    a) Paste them below directly into `DEFAULT_CONFIG`, OR
 *    b) Create a `.env` file and set the EXPO_PUBLIC_FIREBASE_* variables.
 * 4. In Firebase Console -> Build -> Realtime Database -> Create Database (start in test mode).
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const DEFAULT_CONFIG: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

export const getFirebaseConfig = (): FirebaseConfig => DEFAULT_CONFIG;

export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(
    config.apiKey &&
    config.apiKey !== 'YOUR_API_KEY' &&
    config.projectId &&
    config.projectId !== 'YOUR_PROJECT_ID' &&
    config.appId &&
    config.appId !== 'YOUR_APP_ID'
  );
};

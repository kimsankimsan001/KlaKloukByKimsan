/**
 * Firebase Configuration for Kla Klouk by Kimsan
 *
 * Connected Project: kla-klouk-by-kimsan
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const DEFAULT_CONFIG: FirebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyDN3A1L1gMfxrPMawN78ZBYf5NwQz_LZ54',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'kla-klouk-by-kimsan.firebaseapp.com',
  databaseURL:
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://kla-klouk-by-kimsan-default-rtdb.firebaseio.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    'kla-klouk-by-kimsan',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'kla-klouk-by-kimsan.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    '633336390448',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    '1:633336390448:web:72d0c909ca447707701ef5',
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

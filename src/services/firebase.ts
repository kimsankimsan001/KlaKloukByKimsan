import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getFirebaseConfig, isFirebaseConfigured } from './firebaseConfig';

let app: FirebaseApp | null = null;
let db: Database | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  }
  return app;
};

export const getFirebaseDb = (): Database | null => {
  if (!db) {
    const firebaseApp = getFirebaseApp();
    if (firebaseApp) {
      const config = getFirebaseConfig();
      db = config.databaseURL
        ? getDatabase(firebaseApp, config.databaseURL)
        : getDatabase(firebaseApp);
    }
  }
  return db;
};

export { isFirebaseConfigured };

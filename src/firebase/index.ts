
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigAvailable = firebaseConfig && firebaseConfig.projectId;

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
        // These environment variables are set by the Firebase CLI when running the emulator suite.
        const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
        const firestorePort = parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || '8080');
        const authPort = parseInt(process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || '9099');

        console.log(`Connecting to emulators: Firestore on ${host}:${firestorePort}, Auth on ${host}:${authPort}`);

        connectFirestoreEmulator(firestore, host, firestorePort);
        connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
    }
    
    return getSdks(app);

  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';


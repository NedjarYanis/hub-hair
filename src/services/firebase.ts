import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCETGuN1OMbAeJ2Myl534YhH7G4Ngo6-V4",
  authDomain: "barberglassapp.firebaseapp.com",
  projectId: "barberglassapp",
  storageBucket: "barberglassapp.firebasestorage.app",
  messagingSenderId: "220212034637",
  appId: "1:220212034637:web:da96288089e86950383004",
  measurementId: "G-K2HRG63LWF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
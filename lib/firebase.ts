import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCoowi2BQh-2BcQ9iNQQTYNXNLa2h7ZEmY",
  authDomain: "handyman-1bb2d.firebaseapp.com",
  projectId: "handyman-1bb2d",
  storageBucket: "handyman-1bb2d.firebasestorage.app",
  messagingSenderId: "816588253972",
  appId: "1:816588253972:web:4847bb3aec639ed5673001",
};

const isNewApp = getApps().length === 0;

export const firebaseApp = isNewApp ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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

export const firebaseAuth = (() => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
})();
export const firebaseDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLJ0IE3Uc9N8xjg-rjRK11fpDacLS2s6c",
  authDomain: "authapp-39400.firebaseapp.com",
  projectId: "authapp-39400",
  storageBucket: "authapp-39400.appspot.com",
  messagingSenderId: "116130258268",
  appId: "1:116130258268:web:099cbecbe38aae99ba7599"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

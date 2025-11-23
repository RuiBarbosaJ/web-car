import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNr8SnVkQCQZdY5ytkSioDkfrRhXKYgI0",
  authDomain: "web-car-fe767.firebaseapp.com",
  projectId: "web-car-fe767",
  storageBucket: "web-car-fe767.firebasestorage.app",
  messagingSenderId: "540529444504",
  appId: "1:540529444504:web:30b7df07f607a8509572ed",
  measurementId: "G-PL4W8BV2RW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

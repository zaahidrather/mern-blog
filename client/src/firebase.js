// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ec8f4.firebaseapp.com",
  projectId: "mern-blog-ec8f4",
  storageBucket: "mern-blog-ec8f4.firebasestorage.app",
  messagingSenderId: "55276223724",
  appId: "1:55276223724:web:e2616d755a49579f1fb9c9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

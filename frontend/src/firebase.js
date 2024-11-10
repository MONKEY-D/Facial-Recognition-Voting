// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "facerecog-b8e75.firebaseapp.com",
  projectId: "facerecog-b8e75",
  storageBucket: "facerecog-b8e75.firebasestorage.app",
  messagingSenderId: "209945584924",
  appId: "1:209945584924:web:fbf9507d306f6297ec46d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
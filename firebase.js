// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Authentication
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHg-x0PGc2hsZW_1pJt038MO2jO8NukXM",
  authDomain: "uefnmap-86f68.firebaseapp.com",
  projectId: "uefnmap-86f68",
  storageBucket: "uefnmap-86f68.firebasestorage.app",
  messagingSenderId: "761601309620",
  appId: "1:761601309620:web:ffa36beb555b11819c90e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

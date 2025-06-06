// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "REMOVED_FIREBASE_API_KEY",
  authDomain: "product-recommendation-pro.firebaseapp.com",
  projectId: "product-recommendation-pro",
  storageBucket: "product-recommendation-pro.firebasestorage.app",
  messagingSenderId: "117520978055",
  appId: "1:117520978055:web:42bfe75bbfbbeed02e6822"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
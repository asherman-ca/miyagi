// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "miyagi-a7b3e.firebaseapp.com",
  projectId: "miyagi-a7b3e",
  storageBucket: "miyagi-a7b3e.appspot.com",
  messagingSenderId: "362982907996",
  appId: "1:362982907996:web:14fb7dd2bab151eeed4699",
  measurementId: "G-R3VYZFWQYM"
};

// Initialize Firebase (we dont need to store it as a variable)
initializeApp(firebaseConfig)
export const db = getFirestore()

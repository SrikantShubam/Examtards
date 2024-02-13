import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBx8h5z5CYDmIT1lLjo5O_aCzgyN18aE1o",
  authDomain: "exam-tards.firebaseapp.com",
  projectId: "exam-tards",
  storageBucket: "exam-tards.appspot.com",
  messagingSenderId: "334185177163",
  appId: "1:334185177163:web:3fd83f10e1b08683daadce",
  measurementId: "G-G7ZT7PTDRT"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider= new GoogleAuthProvider();
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {auth,provider};

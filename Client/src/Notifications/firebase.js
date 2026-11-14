// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "notificationstest-1185a.firebaseapp.com",
  projectId: "notificationstest-1185a",
  storageBucket: "notificationstest-1185a.firebasestorage.app",
  messagingSenderId: "807802765745",
  appId: "1:807802765745:web:6c2add16c7796a1d5dfd90",
  measurementId: "G-M88DYX6D82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export default app;
const analytics = getAnalytics(app);
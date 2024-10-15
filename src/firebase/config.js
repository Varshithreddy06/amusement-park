// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9jzTanDDuknefhvsdctKg3tmgjYhC-IQ",
  authDomain: "amusement-park-8fd11.firebaseapp.com",
  projectId: "amusement-park-8fd11",
  databaseURL: "https://amusement-park-8fd11-default-rtdb.firebaseio.com/",
  storageBucket: "amusement-park-8fd11.appspot.com",
  messagingSenderId: "482987516007",
  appId: "1:482987516007:web:7be72ed83ff58ddd5f74c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };

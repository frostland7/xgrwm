// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsmOvGkCz__iJceVl6T71HyX_lABCv4R0",
  authDomain: "xgram-24c32.firebaseapp.com",
  databaseURL: "https://xgram-24c32-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xgram-24c32",
  storageBucket: "xgram-24c32.firebasestorage.app",
  messagingSenderId: "484391687742",
  appId: "1:484391687742:web:d2cbd2a5b3ebeb2447a36f",
  measurementId: "G-1RS3SLYYQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  databaseURL: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// firebase.js
// Handles Firebase initialization and exports db for use in other scripts
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWXsPmjw6N4j52NjaaenEKdQbgRFzMKsg",
  authDomain: "portfolio-15a91.firebaseapp.com",
  projectId: "portfolio-15a91",
  databaseURL: "https://portfolio-15a91-default-rtdb.firebaseio.com/",
  storageBucket: "portfolio-15a91.firebasestorage.app",
  messagingSenderId: "529530381054",
  appId: "1:529530381054:web:1c5b65d89fce0156317baf",
  measurementId: "G-4W9B4S27ML"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db };

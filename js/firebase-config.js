// ===== FIREBASE CONFIGURATION =====
// Paste your Firebase web app configuration below.
// You can get this from the Firebase Console: Project Settings > General > Your apps.
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let auth = null;
let firebaseEnabled = false;

if (typeof firebase !== 'undefined') {
  try {
    // Only initialize if the project ID is custom (not the placeholder)
    if (FIREBASE_CONFIG.projectId && !FIREBASE_CONFIG.projectId.includes("YOUR_PROJECT_ID")) {
      firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      auth = firebase.auth();
      firebaseEnabled = true;
      console.log("Firebase initialized successfully.");
    } else {
      console.log("Firebase credentials are not set. Running in Local Mode (localStorage).");
    }
  } catch (err) {
    console.error("Firebase failed to initialize:", err);
  }
} else {
  console.log("Firebase SDK scripts not loaded. Running in Local Mode (localStorage).");
}

// Attach to window so all other scripts can access them
window.db = db;
window.auth = auth;
window.firebaseEnabled = firebaseEnabled;

// Replace with your own Firebase config (from step 7 above)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvoRgdbdc4Ep7FUJz5Ve9OvLmZJ5PsYbo",
  authDomain: "aifinsage.firebaseapp.com",
  projectId: "aifinsage",
  storageBucket: "aifinsage.firebasestorage.app",
  messagingSenderId: "91505948594",
  appId: "1:91505948594:web:cd48baba045706c00996ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
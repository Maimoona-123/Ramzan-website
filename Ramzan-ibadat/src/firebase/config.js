import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ91xt6KsTm685f9Hd79AcpDHErMDLppM",
  authDomain: "signuploginauth-c0a17.firebaseapp.com",
  projectId: "signuploginauth-c0a17",
  storageBucket: "signuploginauth-c0a17.firebasestorage.app",
  messagingSenderId: "779189773796",
  appId: "1:779189773796:web:836a454ccf687697f1d3f1",
  measurementId: "G-CYMJTTXQKG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Safety net — 3 second baad force loading false
    const timeout = setTimeout(() => setLoading(false), 3000);

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout); // auth aagaya — timeout cancel

      if (firebaseUser) {
        setUser(firebaseUser);
        // Firestore fetch — background mein, loading block nahi karega
        getDoc(doc(db, "users", firebaseUser.uid))
          .then(snap => { if (snap.exists()) setUserData(snap.data()); })
          .catch(err => console.warn("Firestore offline:", err.message));
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false); // ← foran false — Firestore ka wait nahi
    });

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid, name, email,
      createdAt: serverTimestamp(), ramadanYear: 1447,
    }).catch(e => console.warn("User doc:", e.message));
    return cred;
  };

  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userData, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
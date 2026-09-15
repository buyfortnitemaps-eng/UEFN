
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { usePathname } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  // Only account pages need to wait for authentication before rendering.
  // Public catalog content must also be present in the initial server HTML.
  const waitForAuth = !pathname || /^\/(admin|auth|cart|my-assets)(\/|$)/.test(pathname);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // AuthContext.js এর ভেতরে
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(
            `https://uefn-maps-server.vercel.app/api/v1/users/${firebaseUser.uid}`,
          );
          const result = await res.json();

          if (result.success) {
            setMongoUser(result.data); // এখানে role সহ সব ডাটা থাকবে
          }
        } catch (err) {
          console.error("User sync error:", err);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setMongoUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, mongoUser }}>
      {(!loading || !waitForAuth) && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

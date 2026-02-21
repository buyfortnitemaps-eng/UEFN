import { auth } from "../../../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

// পাসওয়ার্ড রিসেট ইমেইল পাঠানোর ফাংশন
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const logOut = () => signOut(auth);

export const updateUserProfile = (name) =>
  updateProfile(auth.currentUser, { displayName: name });

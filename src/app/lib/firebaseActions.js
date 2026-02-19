import { auth } from "../../../firebase";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";

export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const logOut = () => signOut(auth);
export const updateUserProfile = (name) => updateProfile(auth.currentUser, { displayName: name });
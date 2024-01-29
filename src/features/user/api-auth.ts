import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => auth.signOut();

export const authCheckState = (onSuccess: Function, onFail: Function) =>
  auth.onAuthStateChanged((user) => {
    if (user) {
      onSuccess();
    } else onFail();
  });

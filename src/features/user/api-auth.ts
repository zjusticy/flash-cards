import { auth } from "utils/firebase";

export const signIn = (email: string, password: string) =>
  auth.signInWithEmailAndPassword(email, password);

export const signOut = () => auth.signOut();

export const authCheckState = (onSuccess: Function, onFail: Function) =>
  auth.onAuthStateChanged((user) => {
    if (user) {
      onSuccess();
    } else onFail();
  });

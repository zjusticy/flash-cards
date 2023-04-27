import { auth } from "../../components/Firebase/firebase";

export const signIn = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
  return auth.signOut();
};

export const authCheckState = (onSuccess: Function, onFail: Function) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      onSuccess();
    } else onFail();
  });
};

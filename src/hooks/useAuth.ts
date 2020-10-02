import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";

import type { RootState } from "../index";

export default function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector<RootState, AuthState>((state) => state.auth);

  const onAuth = useCallback(
    (email: string, password: string) => dispatch(signIn(email, password)),
    [dispatch]
  );
  const onLogout = useCallback(() => dispatch(signOut()), [dispatch]);
  const onAuthCheck = useCallback(() => dispatch(authCheckState()), [dispatch]);

  return {
    isAuth: auth.isAuth,
    error: auth.error,
    isLoading: auth.isLoading,
    onAuth,
    onLogout,
    onAuthCheck,
  };
}

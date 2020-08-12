import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import { signIn, signOut, authCheckState } from "../store/auth";

export default function useAuth() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const onAuth = useCallback(
    (email, password) => dispatch(signIn(email, password)),
    [dispatch]
  );
  const onLogout = useCallback(() => dispatch(signOut()), [dispatch]);
  const onAuthCheck = useCallback(() => dispatch(authCheckState()), [dispatch]);

  return {
    isAuth,
    error,
    loading,
    onAuth,
    onLogout,
    onAuthCheck,
  };
}

// import useSWR from "swr";
import { useEffect, useState } from "react";

// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import { useCardStore } from "@/store/zustand";
import { authCheckState } from "./api-auth";

// export default function useAuth() {
//   const dispatch = useDispatch();
//   const auth = useSelector<RootState, AuthState>((state) => state.auth);

//   const onAuth = useCallback(
//     (email: string, password: string) => dispatch(signIn(email, password)),
//     [dispatch]
//   );
//   const onLogout = useCallback(() => dispatch(signOut()), [dispatch]);
//   const onAuthCheck = useCallback(() => dispatch(authCheckState()), [dispatch]);

//   return {
//     isAuth: auth.isAuth,
//     error: auth.error,
//     isLoading: auth.isLoading,
//     onAuth,
//     onLogout,
//     onAuthCheck,
//   };
// }

export default function useAuthCheck() {
  // const [isAuth, setAuthState] = useState(false);
  const [isLoading, setLoadingState] = useState(true);

  const { setAuthState } = useCardStore();

  useEffect(() => {
    const onSuccess = () => {
      setAuthState(true);
      setLoadingState(false);
    };

    const onFail = () => {
      setAuthState(false);
      setLoadingState(false);
    };
    authCheckState(onSuccess, onFail);
  }, [setAuthState, setLoadingState]);

  return {
    isLoading,
  };
}

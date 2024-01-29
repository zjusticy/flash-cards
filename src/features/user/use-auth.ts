import { useState } from "react";

import { useCardStore } from "@/store/zustand";

// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import { signIn } from "./api-auth";

export default function useAuth() {
  //   const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthState } = useCardStore();

  const submitHandler = async (email: string, password: string) => {
    setIsLoading(true);
    signIn(email, password)
      .then(() => {
        setAuthState(true);
        // navigate(`/intro`);
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    error,
    isLoading,
    submitHandler,
  };
}

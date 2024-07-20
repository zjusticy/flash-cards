import { useState } from 'react';
import { useCardStore } from '@/store/zustand';
import { signIn, signOut } from './api-auth';

export default function useAuth() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthState } = useCardStore();

  const submitHandler = async (email: string, password: string) => {
    setIsLoading(true);
    signIn(email, password)
      .then(() => {
        setAuthState(true);
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signOutHandler = async () => {
    setAuthState(false);
    signOut();
  };

  return {
    error,
    isLoading,
    submitHandler,
    signOutHandler,
  };
}

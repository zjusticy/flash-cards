import useSWR from "swr";

// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import getLists from "../api/getLists";
import { auth } from "../../../components/Firebase/firebase";

export default function useGetLists() {
  const userId = auth.currentUser && auth.currentUser.uid;

  const { data, error, isLoading, mutate } = useSWR<string[]>(
    userId ? `/api/lists` : null,
    () => getLists(userId)
  );

  return {
    cardLists: data,
    isLoading,
    error,
    mutate,
  };
}

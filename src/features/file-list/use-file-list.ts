import useSWR from "swr";

// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import { auth } from "@/utils/firebase";
import { getLists, removeList, addLists } from "./api-file-list";

export default function useFileList() {
  const userId = auth.currentUser && auth.currentUser.uid;

  const {
    data: cardLists,
    error,
    isLoading,
    mutate,
  } = useSWR<string[]>(userId ? `/api/lists` : null, () => getLists(userId));

  const delelteList = (_listName: string) => {
    if (cardLists) {
      const newLists = cardLists.filter((list) => list !== _listName);
      localStorage.setItem("lists", JSON.stringify(newLists));
      localStorage.removeItem(`memoryBoard${_listName}`);
      // if (onDelList) onDelList(_listName, newLists);
      removeList(_listName)?.then(() => {
        mutate();
      });
    }
  };

  const addList = (_listName: string) => {
    let newCardLists: string[] = [];
    if (cardLists) {
      newCardLists = cardLists;
    }
    if (cardLists && cardLists.indexOf(_listName) !== -1) {
      // console.log("Exist");
      return;
    }
    if (_listName.trim() === "") {
      // console.log("Can't be empty");
      return;
    }
    localStorage.setItem("lists", JSON.stringify([_listName, ...newCardLists]));

    if (_listName)
      addLists(_listName, (+new Date()).toString())
        .then(() => {
          mutate();
        })
        .catch(() => {});
  };

  return {
    cardLists,
    isLoading,
    error,
    mutate,
    delelteList,
    addList,
  };
}

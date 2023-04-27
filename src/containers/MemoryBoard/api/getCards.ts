import * as React from "react";
import { auth, database } from "../../../components/Firebase/firebase";

export default function getCards(
  activeListName: string
): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    return database.ref(`userData/${userId}/${activeListName}/`).once("value");
  }
  return undefined;
}

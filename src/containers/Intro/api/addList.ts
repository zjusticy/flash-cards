import * as React from "react";
import { auth, database } from "../../../components/Firebase/firebase";

export default function addLists(name: string, id: string): Promise<any> {
  const userId = auth.currentUser && auth.currentUser.uid;
  return database.ref(`userData/${userId}/lists`).update({ [name]: id });
}

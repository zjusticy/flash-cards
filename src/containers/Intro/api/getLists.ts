import * as React from "react";
import { database } from "../../../components/Firebase/firebase";

export default function getLists(userId: string | null): Promise<any> {
  return database
    .ref(`userData/${userId}/lists`)
    .once("value")
    .then((snapshot) => {
      // for (const )
      const listNames = Object.keys(snapshot.val()).sort((a, b) => {
        return (
          parseInt(snapshot.val()[b], 10) - parseInt(snapshot.val()[a], 10)
        );
      });
      // console.log(snapshot.val());
      return listNames;
    });
}

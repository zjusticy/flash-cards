import * as React from "react";
import { auth, database } from "../../../components/Firebase/firebase";
import { CardType } from "../../../types";

export default function updateCard(
  card: CardType,
  activeListName: string
): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId && card.id) {
    return database
      .ref(`userData/${userId}/${activeListName}/`)
      .update({ [card.id]: card });
  }
  // if (userId) {
  //   database
  //     .ref(`userData/${userId}/${activeListName}/`)
  //     .update({ [cardId]: null });
  // }
  return undefined;
}

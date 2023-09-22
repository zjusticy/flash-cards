import { auth, database } from "utils/firebase";
import { CardType } from "./types-memory-card";

export const addCard = (
  card: CardType,
  activeListName: string
): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId && card.id) {
    return database
      .ref(`userData/${userId}/${activeListName}/`)
      .update({ [card.id]: card });
  }
  return undefined;
};

export const getCards = (activeListName: string): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    return database.ref(`userData/${userId}/${activeListName}/`).once("value");
  }
  return undefined;
};

export const removeCard = (
  cardId: string,
  activeListName: string
): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    return database
      .ref(`userData/${userId}/${activeListName}/`)
      .update({ [cardId]: null });
  }
  return undefined;
};

export const updateCard = (
  card: CardType,
  activeListName: string
): Promise<any> | undefined => {
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
};

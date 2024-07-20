import { auth, database } from '@/utils/firebase';
import { ref, update, child, get } from 'firebase/database';

import { CardType } from './types-memory-card';

export const addCard = (
  card: CardType,
  activeListName: string
): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId && card.id) {
    return update(
      ref(database, `userData/${userId}/collections/${activeListName}/`),
      {
        [card.id]: card,
      }
    );
  }
  return undefined;
};

export const getCards = (activeListName: string): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    const dbRef = ref(database);
    return get(
      child(dbRef, `userData/${userId}/collections/${activeListName}/`)
    );
  }
  return undefined;
};

export const removeCard = (
  cardId: string,
  activeListName: string
): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    return update(
      ref(database, `userData/${userId}/collections/${activeListName}/`),
      {
        [cardId]: null,
      }
    );
  }
  return undefined;
};

export const updateCard = (
  card: CardType,
  activeListName: string
): Promise<any> | undefined => {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId && card.id) {
    return update(
      ref(database, `userData/${userId}/collections/${activeListName}/`),
      {
        [card.id]: card,
      }
    );
  }
  return undefined;
};

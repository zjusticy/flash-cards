// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import { CardsDataType } from "store/store";
import { useEffect, useCallback, useState } from "react";
import * as localForage from "localforage";
import { useImmer } from "use-immer";
import { CardType, CardsCollectionType } from "./types-memory-card";

export default function useLocalCards(activeListName: string) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [cardsDataLocal, setCardsDataLocal] = useImmer<CardsDataType>({
    cardsCache: null,
    sortedIds: [],
    activeId: null,
  });

  const getLocalCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const value = await localForage.getItem(activeListName);
      // This code runs once the value has been loaded
      // from the offline store.

      if (!value) {
        await localForage.setItem(activeListName, {});
        setCardsDataLocal((draft) => {
          draft.cardsCache = {};
        });
        return;
      }

      setCardsDataLocal((draft) => {
        draft.cardsCache = value as CardsCollectionType;
        draft.sortedIds = Object.keys(value).sort(
          (a, b) => parseInt(b, 10) - parseInt(a, 10)
        );
      });

      setIsLoading(false);
    } catch (err) {
      // This code runs if there were any errors.
      setError("err");
    }
  }, [activeListName, setCardsDataLocal]);

  useEffect(() => {
    getLocalCards();
  }, [getLocalCards]);

  const onAddCard = async (card: CardType, listName: string) => {
    // setSortedIds((draft) => {
    //   draft.unshift(card.id);
    // });

    if (card.id && cardsDataLocal.cardsCache) {
      setCardsDataLocal((draft) => {
        if (draft.cardsCache) {
          draft.cardsCache[card.id] = card;
          draft.sortedIds.unshift(card.id);
        }
      });
      try {
        await localForage.setItem(listName, {
          ...cardsDataLocal.cardsCache,
          [card.id]: card,
        });
      } catch (err) {
        setError("Add card error");
      }
    }
  };

  const onDeleteCard = async (listName: string, cardId: string) => {
    try {
      if (cardsDataLocal.cardsCache) {
        const newCache = { ...cardsDataLocal.cardsCache };
        delete newCache[cardId];
        await localForage.setItem(listName, newCache);
        setCardsDataLocal((draft) => {
          draft.sortedIds = draft.sortedIds.filter((id) => id !== cardId);
          if (draft.cardsCache) {
            delete draft.cardsCache[cardId];
          }
        });
      }
    } catch (err) {
      setError("Delete card error");
    }

    // addCard(card, listName)?.catch();
  };

  const onUpdateCard = async (listName: string, card: CardType) => {
    setCardsDataLocal((draft) => {
      if (card.id && draft.cardsCache) {
        draft.cardsCache[card.id] = card;
      }
    });
    // updateCard(card, listName)?.catch();

    try {
      if (cardsDataLocal.cardsCache && card.id) {
        const newCache = { ...cardsDataLocal.cardsCache, [card.id]: card };
        await localForage.setItem(listName, newCache);
      }
    } catch (err) {
      setError("Update card error");
    }
  };

  const onCancelled = () => {
    setCardsDataLocal((draft) => {
      draft.activeId = null;
    });
  };

  return {
    cardsDataLocal,
    setCardsDataLocal,
    error,
    onAddCard,
    onDeleteCard,
    onUpdateCard,
    onCancelled,
    isLoading,
  };
}

// import useSWR, { Fetcher } from "swr";

// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import addCard from "../api/addCard";
import removeCard from "../api/removeCard";
import updateCard from "../api/updateCard";
import getCards from "../api/getCards";
import { useGlobalContext } from "../../../store/store";
import { CardsCollectionType, CardType } from "../../../types";

export default function useCards() {
  const {
    // modeS,
    // cardsCache,
    // setCardsCache,
    // setSortedIds,
    // setActiveListName,
    // setActiveId,
    // sortedIds,
    cardsData,
    setCardsData,
  } = useGlobalContext();

  // const { cardsCache, sortedIds } = cardsData;

  const onInitCards = (
    cards: CardsCollectionType,
    listName: string,
    ids: string[],
    id: string | null
  ) => {
    setCardsData((draft) => {
      draft.cardsCache[listName] = cards;
      draft.sortedIds = ids;
      draft.activeListName = listName;
      draft.activeId = id;
    });
  };

  const onInitExist = (
    listName: string,
    ids: Array<string>,
    id: string | null
  ) => {
    setCardsData((draft) => {
      draft.sortedIds = ids;
      draft.activeListName = listName;
      draft.activeId = id;
    });
  };

  const onLoadCards = (listName: string) => {
    getCards(listName)?.then((snapshot) => {
      if (snapshot.val()) {
        const cardIds = Object.keys(snapshot.val()).sort(
          (a, b) => parseInt(b, 10) - parseInt(a, 10)
        );

        onInitCards(snapshot.val(), listName, cardIds, null);
      } else {
        onInitCards({}, listName, [], null);
      }
    });
  };

  const onAddCard = (card: CardType) => {
    // setSortedIds((draft) => {
    //   draft.unshift(card.id);
    // });
    setCardsData((draft) => {
      if (
        Object.prototype.hasOwnProperty.call(
          draft.cardsCache,
          draft.activeListName
        ) &&
        card.id
      ) {
        draft.cardsCache[draft.activeListName][card.id] = card;
        draft.sortedIds.unshift(card.id);
      }
    });
    addCard(card, cardsData.activeListName)?.catch();
  };

  const onDeleteCard = (listName: string, cardId: string) => {
    setCardsData((draft) => {
      delete draft.cardsCache[listName][cardId];
      draft.sortedIds.filter((id) => id !== cardId);
    });
    removeCard(listName, cardId)?.catch();
    // addCard(card, listName)?.catch();
  };

  const onUpdateCard = (listName: string, card: CardType) => {
    setCardsData((draft) => {
      if (card.id) {
        draft.cardsCache[listName][card.id] = card;
      }
    });
    updateCard(card, listName)?.catch();
  };

  const onCancelled = () => {
    setCardsData((draft) => {
      draft.activeId = null;
    });
  };

  return {
    onInitCards,
    onInitExist,
    onAddCard,
    onDeleteCard,
    onUpdateCard,
    onCancelled,
    onLoadCards,
  };
}

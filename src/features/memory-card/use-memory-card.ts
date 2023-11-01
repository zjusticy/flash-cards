// import { signIn, signOut, authCheckState, AuthState } from "../store/authSlice";
import { CardsDataType } from "store/store";
import { useImmer } from "use-immer";
import { addCard, removeCard, updateCard } from "./api-memory-card";
import { CardType } from "./types-memory-card";

export default function useCardsForPage() {
  //   const { setCardsData } = useGlobalContext();

  const [cardsData, setCardsData] = useImmer<CardsDataType>({
    cardsCache: null,
    sortedIds: [],
    activeId: null,
  });

  const onInitExist = (
    listName: string,
    ids: Array<string>,
    id: string | null
  ) => {
    setCardsData((draft) => {
      draft.sortedIds = ids;
      //   draft.activeListName = listName;
      draft.activeId = id;
    });
  };

  // const onLoadCards = (listName: string) => {
  //   getCards(listName)?.then((snapshot) => {
  //     if (snapshot.val()) {
  //       const cardIds = Object.keys(snapshot.val()).sort(
  //         (a, b) => parseInt(b, 10) - parseInt(a, 10)
  //       );

  //       onInitCards(snapshot.val(), listName, cardIds, null);
  //     } else {
  //       onInitCards({}, listName, [], null);
  //     }
  //   });
  // };

  const onAddCard = (card: CardType, activeListName: string) => {
    // setSortedIds((draft) => {
    //   draft.unshift(card.id);
    // });
    setCardsData((draft) => {
      if (card.id && draft.cardsCache) {
        draft.cardsCache[card.id] = card;
        draft.sortedIds.unshift(card.id);
      }
    });
    addCard(card, activeListName)?.catch();
  };

  const onDeleteCard = (listName: string, cardId: string) => {
    setCardsData((draft) => {
      draft.sortedIds = draft.sortedIds.filter((id) => id !== cardId);
      if (draft.cardsCache) {
        delete draft.cardsCache[cardId];
      }
    });
    removeCard(listName, cardId)?.catch();
    // addCard(card, listName)?.catch();
  };

  const onUpdateCard = (listName: string, card: CardType) => {
    setCardsData((draft) => {
      if (card.id && draft.cardsCache) {
        draft.cardsCache[card.id] = card;
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
    // onInitCards,
    cardsData,
    setCardsData,
    onInitExist,
    onAddCard,
    onDeleteCard,
    onUpdateCard,
    onCancelled,
  };
}

import useSWR from "swr";
// import { useEffect } from "react";
// import { useGlobalContext } from "store/store";
import { getCards } from "./api-memory-card";

export default function useCards(activeListName: string) {
  // const { setCardsData } = useGlobalContext();

  const {
    data: cards,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/cards/${activeListName}`, async () => {
    // const userId = auth.currentUser && auth.currentUser.uid;
    const snapshot = await getCards(activeListName);
    if (snapshot && snapshot.val()) {
      return snapshot.val();
    }

    // onInitCards({}, myBoard.listName, [], null);
    return {};
  });

  // const { cardsCache, sortedIds } = cardsData;

  // const onInitCards = (
  //   cards: CardsCollectionType,
  //   listName: string,
  //   ids: string[],
  //   id: string | null
  // ) => {
  //   setCardsData((draft) => {
  //     draft.cardsCache[listName] = cards;
  //     draft.sortedIds = ids;
  //     draft.activeListName = listName;
  //     draft.activeId = id;
  //   });
  // };

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

  return {
    // onInitCards,
    cards,
    mutate,
    // onLoadCards,
    error,
    isLoading,
  };
}

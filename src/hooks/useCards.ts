import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import type { RootState } from "../index";

import type { CardType, CardsCollectionType } from "../types";

import {
  CardState,
  setInitalCards,
  setInitalExist,
  padClicked,
  padCancel,
  layoutModeSet,
  editModeSet,
  asyncAddList,
  getLists,
  asyncDeleteList,
  asyncAddCard,
  asyncUpdateCard,
  asyncDeleteCard,
  asyncLoadCards,
} from "../store/cardsSlice";

export default function useCards() {
  const dispatch = useDispatch();
  const cardsState = useSelector<RootState, CardState>((state) => state.cards);
  // const cardsCache = useSelector((state) => state.cards.cardsCache);
  // const sortedIds = useSelector((state) => state.cards.sortedIds);
  // const activeListName = useSelector((state) => state.cards.activeListName);
  // const activeId = useSelector((state) => state.cards.activeId);
  // const modeS = useSelector((state) => state.cards.modeS);
  // const modeE = useSelector((state) => state.cards.modeE);

  const onInitCards = useCallback(
    (
      cards: CardsCollectionType,
      listName: string,
      ids: string[],
      id: string | null = null
    ) => dispatch(setInitalCards(cards, listName, ids, id)),
    [dispatch]
  );

  const onInitExist = useCallback(
    (listName: string, ids: string[], id: string | null = null) =>
      dispatch(setInitalExist(listName, ids, id)),
    [dispatch]
  );

  const onModeFlip = useCallback(() => dispatch(layoutModeSet()), [dispatch]);

  const onEditModeFlip = useCallback(() => dispatch(editModeSet()), [dispatch]);

  const onGetLists = useCallback(() => dispatch(getLists()), [dispatch]);

  const onAddList = useCallback(
    (listName: string, id: string) => dispatch(asyncAddList(listName, id)),
    [dispatch]
  );

  const onDelList = useCallback(
    (listName: string, lists: string[]) =>
      dispatch(asyncDeleteList(listName, lists)),
    [dispatch]
  );

  const onAddCard = useCallback(
    (card: CardType) => dispatch(asyncAddCard(card)),
    [dispatch]
  );

  const onDeleteCard = useCallback(
    (cardId: string) => dispatch(asyncDeleteCard(cardId)),
    [dispatch]
  );

  const onLoadCards = useCallback(
    (listName: string) => dispatch(asyncLoadCards(listName)),
    [dispatch]
  );

  const onUpdateCard = useCallback(
    (card: CardType) => dispatch(asyncUpdateCard(card)),
    [dispatch]
  );

  const onCancelled = useCallback(() => dispatch(padCancel()), [dispatch]);

  const onClickPad = useCallback(
    (cardId: string) => dispatch(padClicked(cardId)),
    [dispatch]
  );

  return {
    listNames: cardsState.listNames,
    cardsCache: cardsState.cardsCache,
    sortedIds: cardsState.sortedIds,
    activeListName: cardsState.activeListName,
    activeId: cardsState.activeId,
    modeS: cardsState.modeS,
    modeE: cardsState.modeE,
    onInitCards,
    onInitExist,
    onModeFlip,
    onEditModeFlip,
    onGetLists,
    onAddList,
    onDelList,
    onAddCard,
    onDeleteCard,
    onLoadCards,
    onUpdateCard,
    onCancelled,
    onClickPad,
  };
}

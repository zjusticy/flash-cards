import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import {
  initCards,
  initExist,
  clickPad,
  padDeactive,
  modeFlip,
  editModeFlip,
  onAddList,
  getLists,
  deleteList,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  loadCards,
} from "../store/cards";

export default function useCards() {
  const dispatch = useDispatch();
  const listNames = useSelector((state) => state.cards.listNames);
  const cardsCache = useSelector((state) => state.cards.cardsCache);
  const sortedIds = useSelector((state) => state.cards.sortedIds);
  const activeListName = useSelector((state) => state.cards.activeListName);
  const activeId = useSelector((state) => state.cards.activeId);
  const modeS = useSelector((state) => state.cards.modeS);
  const modeE = useSelector((state) => state.cards.modeE);

  const _onInitCards = useCallback(
    (cards, listName, ids, id = null) =>
      dispatch(initCards(cards, listName, ids, id)),
    [dispatch]
  );

  const _onInitExist = useCallback(
    (listName, ids, id = null) => dispatch(initExist(listName, ids, id)),
    [dispatch]
  );

  const _onModeFlip = useCallback(() => dispatch(modeFlip()), [dispatch]);

  const _onEditModeFlip = useCallback(() => dispatch(editModeFlip()), [
    dispatch,
  ]);

  const _onGetLists = useCallback(() => dispatch(getLists()), [dispatch]);

  const _onAddList = useCallback(
    (listName, id) => dispatch(onAddList(listName, id)),
    [dispatch]
  );

  const _onDelList = useCallback(
    (listName, lists) => dispatch(deleteList(listName, lists)),
    [dispatch]
  );

  const _onAddCard = useCallback((card) => dispatch(onAddCard(card)), [
    dispatch,
  ]);

  const _onDeleteCard = useCallback(
    (cardId) => dispatch(onDeleteCard(cardId)),
    [dispatch]
  );

  const _onLoadCards = useCallback(
    (listName) => dispatch(loadCards(listName)),
    [dispatch]
  );

  const _onUpdateCard = useCallback(
    (listName) => dispatch(onUpdateCard(listName)),
    [dispatch]
  );

  const _onCancelled = useCallback(
    (listName) => dispatch(padDeactive(listName)),
    [dispatch]
  );

  const _onClickPad = useCallback((cardId) => dispatch(clickPad(cardId)), [
    dispatch,
  ]);

  return {
    listNames,
    cardsCache,
    sortedIds,
    activeListName,
    activeId,
    modeS,
    modeE,
    onInitCards: _onInitCards,
    onInitExist: _onInitExist,
    onModeFlip: _onModeFlip,
    onEditModeFlip: _onEditModeFlip,
    onGetLists: _onGetLists,
    onAddList: _onAddList,
    onDelList: _onDelList,
    onAddCard: _onAddCard,
    onDeleteCard: _onDeleteCard,
    onLoadCards: _onLoadCards,
    onUpdateCard: _onUpdateCard,
    onCancelled: _onCancelled,
    onClickPad: _onClickPad,
  };
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { auth, database } from "../components/Firebase/firebase";

import { CardType, CardsCollectionType, CardsCacheType } from "../types";

import type { RootState, AppThunk } from "../index";

type InitPayload = {
  cards: CardsCollectionType;
  listName: string;
  ids: string[];
  id: string | null;
};

export type CardState = {
  // Name set of all card lists
  listNames: string[];
  // Cache of all lists, has the structure like {name1:{card1, card2}, name2:{card3, card4}...}
  cardsCache: CardsCacheType;
  // Sorted Ids for one active list of cards
  sortedIds: string[];
  // list of cards being operated
  activeListName: string;
  // id of card being operated
  activeId: string | null;
  // true: single column, false: double columns
  modeS: boolean;
  // true: single column, false: double columns
  modeE: boolean;
  // waiting state before the data fetching finish
  // loading: false,
};

const initialState: CardState = {
  listNames: [],
  cardsCache: {},
  sortedIds: [],
  activeListName: "",
  activeId: null,
  modeS: true,
  modeE: false,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setInitalCards: {
      reducer: (state, { payload }: PayloadAction<InitPayload>) => {
        state.cardsCache[payload.listName] = payload.cards;
        state.sortedIds = payload.ids;
        state.activeListName = payload.listName;
        state.activeId = payload.id;
      },
      prepare: (
        cards: CardsCollectionType,
        listName: string,
        ids: string[],
        id: string | null = null
      ) => {
        return { payload: { cards, listName, ids, id } };
      },
    },

    setInitalExist: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ ids: string[]; listName: string; id: string | null }>
      ) => {
        state.sortedIds = payload.ids;
        state.activeListName = payload.listName;
        state.activeId = payload.id;
      },
      prepare: (listName: string, ids: string[], id: string | null = null) => {
        return { payload: { listName, ids, id } };
      },
    },

    addCard: {
      reducer: (
        state,
        { payload }: PayloadAction<{ listName: string; card: CardType }>
      ) => {
        if (
          Object.prototype.hasOwnProperty.call(
            state.cardsCache,
            payload.listName
          ) &&
          payload.card.id
        ) {
          state.cardsCache[payload.listName][payload.card.id] = payload.card;
          state.sortedIds.unshift(payload.card.id);
        }
      },
      prepare: (listName: string, card: CardType) => {
        return { payload: { listName, card } };
      },
    },

    setLists: (state, { payload }: PayloadAction<string[]>) => {
      state.listNames = payload;
    },

    addList: (state, { payload }: PayloadAction<string>) => {
      state.listNames.unshift(payload);
    },

    deleteList: (state, { payload }: PayloadAction<string>) => {
      delete state.cardsCache[payload];
    },

    deleteCard: {
      reducer: (
        state,
        { payload }: PayloadAction<{ listName: string; cardId: string }>
      ) => {
        delete state.cardsCache[payload.listName][payload.cardId];

        state.sortedIds = state.sortedIds.filter((id) => id !== payload.cardId);
      },
      prepare: (listName: string, cardId: string) => {
        return { payload: { listName, cardId } };
      },
    },

    deactivateList: (state) => {
      state.activeListName = "";
    },

    updateCard: {
      reducer: (
        state,
        { payload }: PayloadAction<{ listName: string; card: CardType }>
      ) => {
        if (payload.card.id) {
          state.cardsCache[payload.listName][payload.card.id] = payload.card;
        }
      },
      prepare: (listName: string, card: CardType) => {
        return { payload: { listName, card } };
      },
    },

    padClicked: (state, { payload }: PayloadAction<string>) => {
      state.activeId = payload;
    },

    padCancel: (state) => {
      state.activeId = null;
    },

    initModeSet: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          modeSingleBoard: boolean;
          modeSingleUpdate: boolean;
        }>
      ) => {
        state.modeS = payload.modeSingleUpdate;
        state.modeE = payload.modeSingleBoard;
      },
      prepare: (modeSingleBoard: boolean, modeSingleUpdate: boolean) => {
        return { payload: { modeSingleBoard, modeSingleUpdate } };
      },
    },

    layoutModeSet: (state) => {
      state.modeS = !state.modeS;
    },

    editModeSet: (state) => {
      state.modeE = !state.modeE;
    },
  },
});

export const {
  setInitalCards,
  setInitalExist,
  addCard,
  setLists,
  addList,
  deleteList,
  deleteCard,
  deactivateList,
  updateCard,
  padClicked,
  padCancel,
  initModeSet,
  layoutModeSet,
  editModeSet,
} = cardsSlice.actions;

export default cardsSlice.reducer;

export const getLists = (): AppThunk => {
  return (dispatch) => {
    dispatch(deactivateList());
    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId) {
      database
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
          if (listNames) dispatch(setLists(listNames));
        })
        .catch(() => {
          // console.log(err.message);
        });
    }
  };

  // dispatch(initCards({}, name, [], null));
};

export const asyncAddList = (name: string, id: string): AppThunk => {
  return (dispatch) => {
    // this.setState({lists:  [...this.state.lists, this.state.listName] });
    // localStorage.setItem('lists', JSON.stringify([...this.props.lists, this.state.listName]));
    // localStorage.setItem(this.state.listName, JSON.stringify([]));
    dispatch(setInitalCards({}, name, [], null));

    dispatch(addList(name));

    const userId = auth.currentUser && auth.currentUser.uid;

    if (userId) {
      database
        .ref(`userData/${userId}/lists`)
        .update({ [name]: id })
        .catch(() => {
          // console.log(err.message);
        });
    }
  };
};

export const asyncDeleteList = (name: string, lists: string[]): AppThunk => {
  return (dispatch) => {
    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId) {
      const updates: any = {};
      updates[`userData/${userId}/lists/${name}`] = null;
      updates[`userData/${userId}/${name}`] = null;
      database.ref().update(updates);

      dispatch(setLists(lists));
      dispatch(deleteList(name));
    }
  };
};

export const asyncAddCard = (card: CardType): AppThunk => {
  return (dispatch, getState) => {
    const listName = getState().cards.activeListName;
    dispatch(addCard(listName, card));

    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId && card.id) {
      database
        .ref(`userData/${userId}/${listName}/`)
        .update({ [card.id]: card })
        .catch(function () {
          // console.error("Error adding document: ", error);
        });
    }
  };
};

export const asyncUpdateCard = (card: CardType): AppThunk => {
  return (dispatch, getState) => {
    const listName = getState().cards.activeListName;
    dispatch(updateCard(listName, card));
    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId && card.id) {
      database
        .ref(`userData/${userId}/${listName}/`)
        .update({ [card.id]: card })
        .catch(function () {
          // console.error("Error adding document: ", error);
        });
    }
  };
};

export const asyncDeleteCard = (cardId: string): AppThunk => {
  return (dispatch, getState) => {
    const listName = getState().cards.activeListName;
    dispatch(deleteCard(listName, cardId));
    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId) {
      database
        .ref(`userData/${userId}/${listName}/`)
        .update({ [cardId]: null })
        .catch(function () {
          // console.error("Error adding document: ", error);
        });
    }
  };
};

export const asyncLoadCards = (listName: string): AppThunk => {
  return (dispatch) => {
    const userId = auth.currentUser && auth.currentUser.uid;
    if (userId) {
      database
        .ref(`userData/${userId}/${listName}/`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            const cardIds = Object.keys(snapshot.val()).sort((a, b) => {
              return parseInt(b, 10) - parseInt(a, 10);
            });

            dispatch(setInitalCards(snapshot.val(), listName, cardIds));
          } else {
            dispatch(setInitalCards({}, listName, []));
          }
        })
        .catch(function () {
          // console.error("Error adding document: ", error);
        });
    }
  };
};

export const cardsSelector = (state: RootState) => state.cards;

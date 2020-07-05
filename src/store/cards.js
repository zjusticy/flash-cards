import { auth, database } from "../components/Firebase/firebase";
import updateObject from "./utility";

const initialState = {
  // Name set of all card lists
  listNames: [],
  // Cache of all lists, has the structure like {name1:{card1, card2}, name2:{card3, card4}...}
  cardsCache: {},
  // Sorted Ids for one active list of cards
  sortedIds: [],
  // list of cards being operated
  activeListName: "",
  // id of card being operated
  activeId: null,
  // true: single column, false: double columns
  modeS: true,
  // waiting state before the data fetching finish
  // loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_CARDS":
      return updateObject(state, {
        cardsCache: { ...state.cardsCache, [action.listName]: action.cards },
        sortedIds: action.ids,
        activeListName: action.listName,
        activeId: action.id,
      });
    case "INIT_EXIST_LIST":
      return updateObject(state, {
        sortedIds: action.ids,
        activeListName: action.listName,
        activeId: action.id,
      });

    case "ADD_CARD": {
      if (
        Object.prototype.hasOwnProperty.call(state.cardsCache, action.listName)
      ) {
        const newCards = {
          ...state.cardsCache[action.listName],
          [action.card.id]: action.card,
        };
        localStorage.setItem(action.listName, JSON.stringify(newCards));
        const newCardsCache = {
          ...state.cardsCache,
          [action.listName]: newCards,
        };
        return updateObject(state, {
          cardsCache: newCardsCache,
          sortedIds: [action.card.id.toString(), ...state.sortedIds],
        });
      }
      return state;
    }

    case "SET_LISTS":
      return updateObject(state, {
        listNames: action.listNames,
      });

    case "ADD_LIST":
      return updateObject(state, {
        listNames: [action.name, ...state.listNames],
      });

    case "DELETE_LIST": {
      const newCardsCache = { ...state.cardsCache };
      delete newCardsCache[action.listName];
      return updateObject(state, {
        cardsCache: newCardsCache,
      });
    }

    case "DELETE_CARD": {
      const newCards = { ...state.cardsCache[action.listName] };
      delete newCards[action.cardId];
      const newCardsCache = {
        ...state.cardsCache,
        [action.listName]: newCards,
      };
      const newSortedIds = state.sortedIds.filter(
        (id) => id !== action.cardId.toString()
      );
      return updateObject(state, {
        // cards: state.cards.filter(card => card.id !== action.cardId)
        cardsCache: newCardsCache,
        sortedIds: newSortedIds,
      });
    }
    case "DEACTIVATE_LIST":
      return updateObject(state, {
        // cards: state.cards.filter(card => card.id != action.id)
        activeListName: "",
      });

    case "UPDATE_CARD": {
      // update the card
      const newCards = {
        ...state.newCardsCache[action.listName],
        [action.card.id]: action.card,
      };
      const newCardsCache = {
        ...state.cardsCache,
        [action.listName]: newCards,
      };
      return updateObject(state, {
        cardsCache: newCardsCache,
      });
    }

    case "PAD_CLICKED":
      //
      return updateObject(state, {
        activeId: action.cardId,
      });

    case "PAD_CANCEL":
      //
      return updateObject(state, {
        activeId: null,
      });
    case "MODE_SET":
      //
      return updateObject(state, {
        modeS: !state.modeS,
      });
    default:
      return state;
  }
};

export default reducer;

// action creators
export const initCards = (cards, listName, ids, id = null) => {
  return {
    type: "INIT_CARDS",
    cards,
    listName,
    ids,
    id,
  };
};

export const initExist = (listName, ids, id = null) => {
  return { type: "INIT_EXIST_LIST", listName, ids, id };
};

export const addCard = (listName, card) => {
  return { type: "ADD_CARD", card, listName };
};

export const setLists = (listNames) => {
  return { type: "SET_LISTS", listNames };
};

export const addList = (name) => {
  return { type: "ADD_LIST", name };
};

export const deleteCard = (listName, cardId) => {
  return { type: "DELETE_CARD", listName, cardId };
};

export const removeList = (listName) => {
  return { type: "DELETE_LIST", listName };
};

export const updateCard = (listName, card) => {
  return { type: "UPDATE_CARD", listName, card };
};

export const deactivateList = () => {
  return { type: "DEACTIVATE_LIST" };
};

export const clickPad = (cardId) => {
  return { type: "PAD_CLICKED", cardId };
};

export const padDeactive = () => {
  return { type: "PAD_CANCEL" };
};

export const modeFlip = () => {
  return { type: "MODE_SET" };
};

export const getLists = () => {
  return (dispatch) => {
    dispatch(deactivateList());
    const userId = auth.currentUser.uid;
    database
      .ref(`userData/${userId}/lists`)
      .once("value")
      .then((snapshot) => {
        // for (const )
        const listNames = Object.keys(snapshot.val()).sort((a, b) => {
          return snapshot.val()[b] - snapshot.val()[a];
        });
        // console.log(snapshot.val());
        listNames && dispatch(setLists(listNames));
      })
      .catch(() => {
        // console.log(err.message);
      });

    // dispatch(initCards({}, name, [], null));
  };
};

export const onAddList = (name, id) => {
  return (dispatch) => {
    // this.setState({lists:  [...this.state.lists, this.state.listName] });
    // localStorage.setItem('lists', JSON.stringify([...this.props.lists, this.state.listName]));
    // localStorage.setItem(this.state.listName, JSON.stringify([]));
    dispatch(initCards({}, name, [], null));

    dispatch(addList(name));

    const userId = auth.currentUser.uid;

    database
      .ref(`userData/${userId}/lists`)
      .set({ [name]: id })
      .catch(() => {
        // console.log(err.message);
      });
  };
};

export const deleteList = (name, lists) => {
  return (dispatch) => {
    const userId = auth.currentUser.uid;

    // database
    //   .ref(`userData/${userId}/lists/${name}`)
    //   .set(null)
    //   .catch(() => {
    //     // console.log(err.message);
    //   });
    // database
    //   .ref(`userData/${userId}/${name}`)
    //   .set(null)
    //   .catch(() => {
    //     // console.log(err.message);
    //   });

    const updates = {};
    updates[`userData/${userId}/lists/${name}`] = null;
    updates[`userData/${userId}/${name}`] = null;
    database.ref().update(updates);

    dispatch(setLists(lists));
    dispatch(removeList(name));
  };
};

export const onAddCard = (listName, card) => {
  return (dispatch) => {
    dispatch(addCard(listName, card));

    const userId = auth.currentUser.uid;
    database
      .ref(`userData/${userId}/${listName}/`)
      .set({ [card.id]: card })
      .catch(function () {
        // console.error("Error adding document: ", error);
      });
  };
};

export const onUpdateCard = (listName, card) => {
  return (dispatch) => {
    dispatch(updateCard(listName, card));
    const userId = auth.currentUser.uid;

    database
      .ref(`userData/${userId}/${listName}/`)
      .update({ [card.id]: card })
      .catch(function () {
        // console.error("Error adding document: ", error);
      });
  };
};

export const onDeleteCard = (listName, cardId) => {
  return (dispatch) => {
    dispatch(deleteCard(listName, cardId));
    const userId = auth.currentUser.uid;
    database
      .ref(`userData/${userId}/${listName}/`)
      .update({ [cardId]: null })
      .catch(function () {
        // console.error("Error adding document: ", error);
      });
  };
};

export const loadCards = (listName) => {
  return (dispatch) => {
    const userId = auth.currentUser.uid;
    database
      .ref(`userData/${userId}/${listName}/`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const cardIds = Object.keys(snapshot.val()).sort((a, b) => {
            return b - a;
          });

          dispatch(initCards(snapshot.val(), listName, cardIds));
        } else {
          dispatch(initCards({}, listName, []));
        }
      })
      .catch(function () {
        // console.error("Error adding document: ", error);
      });
  };
};

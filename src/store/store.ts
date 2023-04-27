import { createContext, useContext } from "react";
import * as React from "react";
import { WritableDraft } from "immer/dist/types/types-external";
import { CardType, CardsCollectionType, CardsCacheType } from "../types";

export type CardsDataType = {
  cardsCache: CardsCacheType;
  sortedIds: Array<string>;
  activeListName: string;
  activeId: string | null;
};

export type GlobalContent = {
  isAuth: boolean;
  setAuthState: (c: boolean) => void;
  // true: single column, false: double columns
  modeS: boolean;
  setModeS: (c: boolean) => void;
  // true: single column, false: double columns
  modeE: boolean;
  setModeE: (c: boolean) => void;

  drawerVisible: boolean;
  setDrawerVisibility: (c: boolean) => void;

  cardsData: CardsDataType;
  setCardsData: (f: (draft: WritableDraft<CardsDataType>) => void) => void;
  //   cardsCache: CardsCacheType;
  //   setCardsCache: (f: (draft: WritableDraft<CardsCacheType>) => void) => void;
  //   sortedIds: Array<string>;
  //   setSortedIds: (f: (draft: string[]) => void | string[]) => void;
  //   activeListName: string;
  //   setActiveListName: (c: string) => void;
  //   activeId: string | null;
  //   setActiveId: (c: string | null) => void;
};

export const MyGlobalContext = createContext<GlobalContent>({
  isAuth: false,
  setAuthState: () => {},
  modeS: false,
  setModeS: () => {},
  modeE: false,
  setModeE: () => {},
  drawerVisible: false,
  setDrawerVisibility: () => {},
  cardsData: {
    cardsCache: {},
    sortedIds: [],
    activeListName: "",
    activeId: null,
  },
  setCardsData: () => {},
  //   cardsCache: {},
  //   setCardsCache: () => {},
  //   sortedIds: [],
  //   setSortedIds: () => {},
  //   activeListName: "",
  //   setActiveListName: () => {},
  //   activeId: null,
  //   setActiveId: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);

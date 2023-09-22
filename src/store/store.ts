import { createContext, useContext } from "react";

// import { WritableDraft } from "immer/dist/types/types-external";
import { CardsCollectionType } from "../types";

export type CardsDataType = {
  cardsCache: CardsCollectionType | null;
  sortedIds: Array<string>;
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

  // cardsData: CardsDataType;
  // setCardsData: (f: (draft: WritableDraft<CardsDataType>) => void) => void;
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
  // setCardsData: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);

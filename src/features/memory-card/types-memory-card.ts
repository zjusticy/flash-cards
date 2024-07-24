export type FlashBackType = {
  again: boolean;
  id: string;
};

export type MemStateType = {
  memName: string;
  memId: string | null;
  memIndex: number;
  flashBack: FlashBackType | null;
  activeList: string[];
  backUpList: string[];
  again: boolean;
  traceBack: boolean;
  done: boolean;
  emptyList: boolean;
};

export type CardType = {
  id: string;
  title: string;
  frontValue: string;
  backValue: string;
  prompt?: string;
};

export type CardsCollectionType = {
  [key: string]: CardType;
};

export type CardsCacheType = {
  [key: string]: CardsCollectionType;
};

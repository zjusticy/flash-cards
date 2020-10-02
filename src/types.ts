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
};

export type CardType = {
  id: string | null;
  title: string;
  frontValue: string;
  backValue: string;
};

export type CardsCollectionType = {
  [key: string]: CardType;
};

export type CardsCacheType = {
  [key: string]: CardsCollectionType;
};

export type Settings = {
  modeSingleBoard: boolean;
  modeSingleUpdate: boolean;
};

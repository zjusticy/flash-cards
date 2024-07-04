import { create } from 'zustand';

type CardStore = {
  isAuth: boolean;
  setAuthState: (c: boolean) => void;
  // true: single column, false: double columns
  modeS: boolean;
  setModeS: (c: boolean) => void;
  // // true: single column, false: double columns
  // modeE: boolean;
  // setModeE: (c: boolean) => void;

  drawerVisible: boolean;
  setDrawerVisibility: (c: boolean) => void;

  // true: local storage, false: on cloud
  useLocalDB: boolean;
  setUseLocalDB: (c: boolean) => void;
};

export const useCardStore = create<CardStore>((set) => ({
  isAuth: false,
  setAuthState: (authState) => set(() => ({ isAuth: authState })),
  modeS: false,
  setModeS: (isModeS) => set(() => ({ modeS: isModeS })),
  // modeE: true,
  // setModeE: (isModeE) => set(() => ({ modeE: isModeE })),
  useLocalDB: false,
  setUseLocalDB: (isLocalDB) => set(() => ({ useLocalDB: isLocalDB })),
  drawerVisible: false,
  setDrawerVisibility: (drawerVisibleState) =>
    set(() => ({ drawerVisible: drawerVisibleState })),
}));

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { auth } from "../components/Firebase/firebase";

import type { AppThunk } from "../index";

export type AuthState = {
  isAuth: boolean;
  error: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  // token: null,
  isAuth: false,
  error: null,
  loading: false,
  // waiting: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    authSuccess: (state) => {
      state.isAuth = true;
      state.error = null;
      state.loading = false;
    },
    checkSuccess: (state) => {
      state.isAuth = true;
      state.error = null;
      state.loading = false;
    },
    authFail: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.loading = false;
    },
    authLogout: (state) => {
      state.isAuth = false;
    },
  },
});

export const {
  authStart,
  authSuccess,
  checkSuccess,
  authFail,
  authLogout,
} = authSlice.actions;

export default authSlice.reducer;

export const signIn = (email: string, password: string): AppThunk => {
  return (dispatch) => {
    dispatch(authStart());

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(authSuccess());
        // dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err: any) => {
        dispatch(authFail(err.message));
      });
  };
};

export const signOut = (): AppThunk => {
  return (dispatch) => {
    auth.signOut();
    dispatch(authLogout());
  };
};

export const authCheckState = (): AppThunk => {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(checkSuccess());
      }
    });
  };
};

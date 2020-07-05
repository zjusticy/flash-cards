import updateObject from "./utility";
import { auth } from "../components/Firebase/firebase";

const initialState = {
  // token: null,
  isAuth: false,
  error: null,
  loading: false,
  waiting: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_START":
      return updateObject(state, { error: null, loading: true });

    case "AUTH_SUCCESS":
      return updateObject(state, {
        // token: action.idToken,
        // userId: action.userId,
        isAuth: true,
        error: null,
        loading: false,
      });

    case "CHECK_SUCCESS":
      return updateObject(state, {
        // token: action.idToken,
        // userId: action.userId,
        isAuth: true,
        error: null,
        loading: false,
        waiting: false,
      });

    case "AUTH_FAIL":
      //
      return updateObject(state, {
        error: action.error,
        loading: false,
      });

    case "AUTH_LOGOUT":
      //
      return updateObject(state, { isAuth: false, waiting: false });
    default:
      return state;
  }
};

export default reducer;

// action creators
export const authStart = () => {
  return {
    type: "AUTH_START",
  };
};

export const authSuccess = () => {
  return {
    type: "AUTH_SUCCESS",
    // idToken: token,
    // userId: userId,
  };
};

export const checkSuccess = () => {
  return {
    type: "CHECK_SUCCESS",
    // idToken: token,
    // userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: "AUTH_FAIL",
    error,
  };
};

export const logout = () => {
  // localStorage.removeItem('token');
  // localStorage.removeItem('expirationDate');
  return {
    type: "AUTH_LOGOUT",
  };
};

export const signIn = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(authSuccess());
        // dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        dispatch(authFail(err.message));
      });
  };
};

export const signOut = () => {
  return (dispatch) => {
    auth.signOut();
    dispatch(logout());
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(checkSuccess());
      }
    });
  };
};

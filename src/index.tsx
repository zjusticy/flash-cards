import * as React from "react";
import ReactDOM from "react-dom";
// import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { configureStore, Action } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

import { ThunkAction } from "redux-thunk";

import "./index.scss";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import cardsReducer from "./store/cardsSlice";
import authReducer from "./store/authSlice";

import "katex/dist/katex.min.css";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({
//   cards: cardsReducer,
//   auth: authReducer,
// });

const store = configureStore({
  reducer: {
    // the convention is to name this photos rather than photosStore but photosStore is clearer to me.
    cards: cardsReducer,
    auth: authReducer,
  },
  // middleware: ['array of middlewares'],
  devTools: process.env.NODE_ENV === "development",
});

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

registerServiceWorker();

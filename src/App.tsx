import { useEffect } from "react";
import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import styles from "./App.module.scss";

import Intro from "./containers/Intro/Intro";
// import AddCard from "./containers/AddCard/AddCard";
import CardUpdate from "./containers/CardUpdate/CardUpdate";
import MemoryBoard from "./containers/MemoryBoard/MemoryBoard";
import useAuth from "./hooks/useAuth";
import useCards from "./hooks/useCards";
import Auth from "./containers/Auth/Auth";
import Spinner from "./components/UI/Spinner/Spinner";
import { Settings } from "./types";

const App = () => {
  // componentWillMount() {
  //   localStorage.setItem('myName', 'Tom');
  // }
  const { isAuth, onAuthCheck, isLoading } = useAuth();

  const { onModeInit } = useCards();

  useEffect(() => {
    onAuthCheck();
  }, [onAuthCheck]);

  useEffect(() => {
    const stickyValue = window.localStorage.getItem("Settings");
    if (stickyValue !== null) {
      const localSettings: Settings = JSON.parse(stickyValue);

      onModeInit(localSettings.modeSingleUpdate, localSettings.modeSingleBoard);
    }
  }, [onModeInit]);

  // let routes = this.props.isWaiting || this.props.isAuthenticated ? (
  const routes = isAuth ? (
    <Switch>
      <Route path="/memoryBoard/:name" component={MemoryBoard} />
      <Route path="/cardCreator/:name" component={CardUpdate} />
      <Route path="/intro" exact component={Intro} />
      <Redirect to="/intro" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/login" component={Auth} />
      <Redirect to="/login" />
    </Switch>
  );

  const mainPage = isLoading ? (
    <div className={styles.marginTop}>
      <Spinner />
    </div>
  ) : (
    routes
  );

  return mainPage;
};

export default App;

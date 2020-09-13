import { useEffect } from "react";
import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

// import Layout from "./hoc/Layout/Layout";

import Intro from "./containers/Intro/Intro";
// import AddCard from "./containers/AddCard/AddCard";
import CardUpdate from "./containers/CardUpdate/CardUpdate";
import MemoryBoard from "./containers/MemoryBoard/MemoryBoard";
import useAuth from "./hooks/useAuth";
import Auth from "./containers/Auth/Auth";

const App = () => {
  // componentWillMount() {
  //   localStorage.setItem('myName', 'Tom');
  // }
  const { isAuth, onAuthCheck } = useAuth();

  useEffect(() => {
    onAuthCheck();
  }, [onAuthCheck]);

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

  return routes;
};

export default App;

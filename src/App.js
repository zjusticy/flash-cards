import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// import Layout from "./hoc/Layout/Layout";

import Intro from "./containers/Intro/Intro";
// import AddCard from "./containers/AddCard/AddCard";
import CardUpdate from "./containers/CardUpdate/CardUpdate";
import MemoryBoard from "./containers/MemoryBoard/MemoryBoard";
// import DonePage from './containers/DonePage/DonePage';
import Auth from "./containers/Auth/Auth";

import * as actions from "./store/auth";

class App extends Component {
  // componentWillMount() {
  //   localStorage.setItem('myName', 'Tom');
  // }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    // let routes = this.props.isWaiting || this.props.isAuthenticated ? (
    const routes = this.props.isAuthenticated ? (
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
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuth,
    isWaiting: state.auth.waiting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

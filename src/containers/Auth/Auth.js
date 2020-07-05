import React, { useState } from "react";
import { connect } from "react-redux";
// import { Redirect } from 'react-router-dom';

// import Input from '../../components/UI/Input/Input';
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import InputCombine from "../../components/UI/InputCombine/InputCombine";

import * as actions from "../../store/auth";

import styles from "./Auth.module.scss";

const Auth = (props) => {
  const initState = {
    email: "",
    password: "",
  };

  const [inputState, changeState] = useState(initState);

  /**
   * Connect input and data
   * @param {object} input
   */
  const inputChangedHandler = (event) => {
    const { name, value } = event.target;

    changeState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(inputState.email, inputState.password);
  };

  // const formElementsArray = [];
  // for ( let key in inputState.controls ) {
  //     formElementsArray.push( {
  //         id: key,
  //         config: inputState.controls[key]
  //     } );
  // }

  let form = (
    <>
      <InputCombine
        name="email"
        tag="Email"
        type="email"
        listName={inputState.email}
        inputChangedHandler={inputChangedHandler}
      />

      <InputCombine
        name="password"
        tag="Password"
        type="password"
        listName={inputState.password}
        inputChangedHandler={inputChangedHandler}
      />
    </>
  );

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = <p>{props.error}</p>;
  }

  // let authRedirect = null;
  // if (props.isAuthenticated) {
  //     authRedirect = <Redirect to={props.authRedirectPath}/>
  // }

  return (
    <div className={styles.auth}>
      {/* authRedirect */}
      {errorMessage}
      <form onSubmit={submitHandler} className={styles.form}>
        {form}
        <div className={styles.btnWrapper}>
          <Button btnType="Success" size="Medium" elementType="submit">
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(actions.signIn(email, password)),
    // onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

import React, { useState } from "react";
// import { Redirect } from 'react-router-dom';

// import Input from '../../components/UI/Input/Input';
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import InputCombine from "../../components/UI/InputCombine/InputCombine";

import useAuth from "../../hooks/useAuth";

import styles from "./Auth.module.scss";

const initState = {
  email: "",
  password: "",
};

const Auth = () => {
  const [inputState, changeState] = useState(initState);

  const { loading, error, onAuth } = useAuth();

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
    onAuth(inputState.email, inputState.password);
  };

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

  if (loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (error) {
    errorMessage = <p>{error}</p>;
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

export default Auth;

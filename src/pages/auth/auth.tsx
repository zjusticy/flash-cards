import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

import useAuth from "features/user/use-auth";

// import Input from '../../components/UI/Input/Input';
import Button from "features/ui/button/button";
import Spinner from "features/ui/spinner/spinner";
import InputCombine from "features/ui/input-combine/input-combine";

// import { signIn } from "../../hooks/api/authApis";
import { useGlobalContext } from "store/store";
import cardsLogo from "assets/images/title_pic_2.png";

// import useAuthCheck from "../../hooks/useAuthCheck";

import styles from "./auth.module.scss";

const initState = {
  email: "",
  password: "",
};

const Auth = () => {
  const [inputState, changeState] = useImmer<{
    email: string;
    password: string;
  }>(initState);

  const navigate = useNavigate();

  const { isAuth, setUseLocalDB } = useGlobalContext();

  const { isLoading, error, submitHandler } = useAuth();

  // const [isLoading, setLoadingState] = useState(false);
  // const [error, setError] = useState(null);

  // const [error, setError] = useAuthCheck();

  useEffect(() => {
    if (isAuth) {
      navigate(`/intro`);
    }
  }, [isAuth, navigate]);

  /**
   * Connect input and data
   */
  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    changeState((draft) => {
      draft[name as "email" | "password"] = value;
    });
  };

  // const submitHandler = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setLoadingState(true);
  //   signIn(inputState.email, inputState.password)
  //     .then(() => {
  //       setAuthState(true);
  //       navigate(`/intro`);
  //       // dispatch(checkAuthTimeout(response.data.expiresIn));
  //     })
  //     .catch((err: any) => {
  //       setError(err.message);
  //     })
  //     .finally(() => {
  //       setLoadingState(false);
  //     });
  // };

  let form = (
    <>
      <div className={styles.inputWrapper}>
        <InputCombine
          name="email"
          tag="Email"
          type="email"
          listName={inputState.email}
          inputChangedHandler={inputChangedHandler}
        />
      </div>

      <div className={styles.inputWrapper}>
        <InputCombine
          name="password"
          tag="Password"
          type="password"
          listName={inputState.password}
          inputChangedHandler={inputChangedHandler}
        />
      </div>
    </>
  );

  if (isLoading) {
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
      <div className={styles.imageHolder}>
        <img src={cardsLogo} alt="Tom's Cards" />
      </div>
      {/* authRedirect */}
      {errorMessage}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler(inputState.email, inputState.password);
        }}
        className={styles.form}
      >
        {form}
        <div className={styles.btnWrapper}>
          <Button
            debounced
            btnType="Success"
            size="Medium"
            elementType="submit"
          >
            SUBMIT
          </Button>
        </div>
      </form>
      <hr className={styles.divider} />
      <div className={styles.btnMiddleWrapper}>
        <Button
          btnType="Success"
          size="Medium"
          elementType="submit"
          clicked={() => {
            setUseLocalDB(true);
            navigate(`/local/intro`);
          }}
        >
          Try it
        </Button>
      </div>
    </div>
  );
};

export default Auth;

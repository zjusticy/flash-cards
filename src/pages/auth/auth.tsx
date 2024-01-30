import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

import { useCardStore } from "@/store/zustand";
import useAuth from "@/features/user/use-auth";
import Button from "@/features/ui/button/button";
import Spinner from "@/features/ui/spinner/spinner";
import InputCombine from "@/features/ui/input-combine/input-combine";

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

  const { isAuth, setUseLocalDB } = useCardStore();

  const { isLoading, error, submitHandler } = useAuth();

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

  let form = (
    <>
      <div className="h-16 mb-8">
        <InputCombine
          name="email"
          tag="Email"
          type="email"
          listName={inputState.email}
          inputChangedHandler={inputChangedHandler}
        />
      </div>

      <div className="h-16 mb-8">
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

  return (
    <div className="my-0 mx-auto max-w-[480px] mt-40 pr-4 pl-4 sm:pr-0 sm:pl-0">
      <div className="h-[80px] flex justify-center mb-[40px]">
        <img src="/images/title_pic_2.png" alt="Tom's Cards" />
      </div>
      {errorMessage}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler(inputState.email, inputState.password);
        }}
      >
        {form}
        <div className="flex justify-end">
          <Button
            debounced
            btnType="Success"
            size="Medium"
            elementType="submit"
            className="w-24 text-[0.75rem]"
          >
            SUBMIT
          </Button>
        </div>
      </form>
      <hr className="mt-12 mb-12 border-0 border-t border-dashed border-gray-400" />
      <div className="flex justify-center">
        <Button
          btnType="Success"
          size="Medium"
          elementType="submit"
          clicked={() => {
            setUseLocalDB(true);
            navigate(`/local/intro`);
          }}
          className="w-32 text-[1rem]"
        >
          Try it
        </Button>
      </div>
    </div>
  );
};

export default Auth;

import * as React from "react";
import { FunctionComponent } from "react";
// import _ from "lodash";
import { useDebouncedCallback } from "use-debounce";

import styles from "./Button.module.scss";

type Props = {
  btnType?: "Success" | "Danger" | "Navi" | "FileM";
  elementType: "normal" | "submit";
  disabled?: boolean;
  size?: "Big" | "Medium" | "Small";
  clicked?: () => void;
  className?: string;
  debounced?: boolean;
};

const Button: FunctionComponent<Props> = ({
  btnType,
  elementType,
  disabled,
  size,
  clicked = () => {},
  className,
  children,
  debounced = false,
}) => {
  let buttonElement = null;

  const debClick = useDebouncedCallback(clicked, 200, {
    leading: true,
    trailing: false,
  });

  const clickFunc = debounced ? debClick.callback : clicked;

  switch (elementType) {
    case "normal":
      buttonElement = (
        <button
          disabled={disabled || false}
          className={`${styles.Button} ${(btnType && styles[btnType]) || ""} ${
            (size && styles[size]) || ""
          } ${className || ""}`}
          onClick={clickFunc}
          type="button"
        >
          {children}
        </button>
      );
      break;
    case "submit":
      buttonElement = (
        <button
          disabled={disabled || false}
          type="submit"
          className={`${styles.Button} ${(btnType && styles[btnType]) || ""} ${
            (size && styles[size]) || ""
          } ${className || ""}`}
          onClick={clickFunc}
        >
          {children}
        </button>
      );
      break;
    default:
      buttonElement = (
        <button
          disabled={disabled || false}
          className={`${styles.Button} ${(btnType && styles[btnType]) || ""} ${
            (size && styles[size]) || ""
          } ${className || ""}`}
          onClick={clickFunc}
          type="button"
        >
          {children}
        </button>
      );
  }

  return buttonElement;
};

export default Button;

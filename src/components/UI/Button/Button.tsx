import * as React from "react";
import { FunctionComponent } from "react";

import styles from "./Button.module.scss";

type Props = {
  btnType?: "Success" | "Danger" | "Navi" | "FileM";
  elementType: "normal" | "submit";
  disabled?: boolean;
  size?: "Big" | "Medium" | "Small";
  clicked?: () => void;
  className?: string;
};

const button: FunctionComponent<Props> = ({
  btnType,
  elementType,
  disabled,
  size,
  clicked,
  className,
  children,
}) => {
  let buttonElement = null;

  switch (elementType) {
    case "normal":
      buttonElement = (
        <button
          disabled={disabled || false}
          className={`${styles.Button} ${(btnType && styles[btnType]) || ""} ${
            (size && styles[size]) || ""
          } ${className || ""}`}
          onClick={clicked || (() => {})}
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
          onClick={clicked || (() => {})}
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
          onClick={clicked || (() => {})}
          type="button"
        >
          {children}
        </button>
      );
  }

  return buttonElement;
};

export default button;

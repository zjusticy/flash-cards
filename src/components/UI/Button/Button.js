import React from "react";
import PropTypes from "prop-types";

import styles from "./Button.module.scss";

const button = (props) => {
  let buttonElement = null;

  switch (props.elementType) {
    case "normal":
      buttonElement = (
        <button
          disabled={props.disabled || false}
          className={`${styles.Button} ${styles[props.btnType] || ""} ${
            styles[props.size] || ""
          } ${props.className || ""}`}
          onClick={props.clicked || (() => {})}
          type="button"
        >
          {props.children}
        </button>
      );
      break;
    case "submit":
      buttonElement = (
        <button
          disabled={props.disabled || false}
          type="submit"
          className={`${styles.Button} ${styles[props.btnType] || ""} ${
            styles[props.size] || ""
          } ${props.className || ""}`}
          onClick={props.clicked || (() => {})}
        >
          {props.children}
        </button>
      );
      break;
    default:
      buttonElement = (
        <button
          disabled={props.disabled || false}
          className={`${styles.Button} ${styles[props.btnType] || ""} ${
            styles[props.size] || ""
          } ${props.className || ""}`}
          onClick={props.clicked || (() => {})}
          type="button"
        >
          {props.children}
        </button>
      );
  }

  return buttonElement;
};

export default button;

button.propTypes = {
  clicked: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  elementType: PropTypes.string.isRequired,
};

button.defaultProps = {
  disabled: false,
  clicked: () => {},
};

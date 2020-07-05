import React from "react";

import styles from "./Input.module.css";

const input = (props) => {
  let inputElement = null;
  const inputClasses = [styles.InputElement];

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={`${inputClasses.join(" ")} ${styles.input}`}
          value={props.value}
          id={props.id}
          onChange={props.changed}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={`${inputClasses.join(" ")} ${styles.textarea}`}
          value={props.value}
          id={props.id}
          onChange={props.changed}
          onFocus={props.focused}
          onBlur={props.blured}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={`${inputClasses.join(" ")} ${styles.select}`}
          value={props.value}
          onChange={props.changed}
          id={props.id}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          value={props.value}
          id={props.id}
          onChange={props.changed}
        />
      );
  }

  return (
    <div className={styles.Input}>
      <label htmlFor={props.id} className={styles.Label}>
        {props.label}
      </label>
      {inputElement}
    </div>
  );
};

export default input;

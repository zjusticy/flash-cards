import * as React from "react";
import { FunctionComponent } from "react";

import styles from "./input.module.scss";

type Props = {
  elementType: "input" | "textarea" | "select";
  value: string;
  id: string;
  iChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tChanged?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sChanged?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  focused: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  blured: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  label?: string;
  ref?: any;
  elementConfig?: { options: { value: string; displayValue: string }[] };
};

const Input: FunctionComponent<Props> = ({
  elementType,
  value,
  id,
  iChanged,
  tChanged,
  sChanged,
  focused,
  blured,
  label = "",
  elementConfig,
  ref,
}) => {
  let inputElement = null;
  const inputClasses = [styles.InputElement];

  switch (elementType) {
    case "input":
      inputElement = (
        <input
          className={`${inputClasses.join(" ")} ${styles.input}`}
          value={value}
          id={id}
          onChange={iChanged}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={`${inputClasses.join(" ")} ${styles.textarea}`}
          value={value}
          id={id}
          onChange={tChanged}
          onFocus={focused}
          onBlur={blured}
          ref={ref}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={`${inputClasses.join(" ")} ${styles.select}`}
          value={value}
          onChange={sChanged}
          id={id}
        >
          {elementConfig &&
            elementConfig.options.map((option) => (
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
          value={value}
          id={id}
          onChange={iChanged}
        />
      );
  }

  return (
    <div className={styles.Input}>
      <label htmlFor={id} className={styles.Label}>
        {label}
      </label>
      {inputElement}
    </div>
  );
};

export default Input;

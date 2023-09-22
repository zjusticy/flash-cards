import * as React from "react";

import styles from "./input-combine.module.scss";

type Props = {
  name: string;
  listName: string;
  tag: string;
  inputChangedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const InputCombine = ({
  name,
  tag,
  listName,
  type,
  inputChangedHandler,
}: Props) => (
  <div className={styles.newNameWrap}>
    <label htmlFor={name}>{tag}</label>
    <input
      name={name}
      value={listName}
      type={type || "text"}
      onChange={inputChangedHandler}
    />
  </div>
);

export default InputCombine;

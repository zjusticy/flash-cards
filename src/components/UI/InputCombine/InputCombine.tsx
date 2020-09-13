import * as React from "react";

import styles from "./InputCombine.module.scss";

type Props = {
  name: string;
  listName: string;
  tag: string;
  inputChangedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const inputCombine = ({
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

export default inputCombine;

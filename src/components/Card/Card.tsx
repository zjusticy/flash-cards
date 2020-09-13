import * as React from "react";

import styles from "./Card.module.scss";

type Props = {
  active: boolean;
  index: number;
  title: string;
  front: string;
  clicked: () => void;
};

const card = ({ active, index, title, front, clicked }: Props) => {
  let attachedclasses = [styles.card];
  if (active) {
    attachedclasses = [styles.card, styles.active];
  }

  return (
    <div
      role="button"
      className={attachedclasses.join(" ")}
      onClick={clicked}
      onKeyDown={() => {}}
      tabIndex={index}
    >
      <h3>{title}</h3>
      <p>{front}</p>
    </div>
  );
};

export default card;

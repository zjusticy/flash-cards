import React from "react";

import styles from "./CardsWrapper.module.scss";

const CardsWrapper = (props) => {
  const classT =
    props.memBoard || props.preview
      ? styles.cardWrapper
      : styles.cardInputWrapper;
  const classSelect = props.mode ? styles.cardWrapperSingle : classT;

  return <div className={classSelect}>{props.children}</div>;
};

export default CardsWrapper;

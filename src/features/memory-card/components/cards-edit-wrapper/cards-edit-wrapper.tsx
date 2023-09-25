import * as React from "react";
import { FunctionComponent } from "react";

import styles from "./cards-edit-wrapper.module.scss";

const CardsEditWrapper: FunctionComponent<{
  memBoard: boolean;
  preview: boolean;
  mode: boolean;
}> = ({ memBoard, preview, mode, children }) => {
  const classT =
    memBoard || preview ? styles.cardWrapper : styles.cardInputWrapper;
  const classSelect = mode ? styles.cardWrapperSingle : classT;

  return <div className={classSelect}>{children}</div>;
};

export default CardsEditWrapper;

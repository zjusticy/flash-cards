import * as React from "react";
import { FunctionComponent } from "react";

import styles from "./Modal.module.scss";
import Backdrop from "../Backdrop/Backdrop";

const Modal: FunctionComponent<{ show: boolean; modalClosed: () => void }> = ({
  show,
  modalClosed,
  children,
}) => (
  <>
    <Backdrop show={show} clicked={modalClosed} />
    <div
      className={styles.Modal}
      style={{
        transform: show ? "translateY(0)" : "translateY(-100vh)",
        opacity: show ? "1" : "0",
      }}
    >
      {children}
    </div>
  </>
);

export default Modal;

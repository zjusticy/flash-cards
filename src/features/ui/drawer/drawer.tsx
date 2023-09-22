import * as React from "react";

import styles from "./drawer.module.scss";

type DrawerParams = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const Drawer = ({ isOpen, children, onClose }: DrawerParams) => (
  <div
    aria-hidden={isOpen ? "false" : "true"}
    className={
      isOpen
        ? `${styles.drawerContainer} ${styles.open}`
        : styles.drawerContainer
    }
  >
    <div className={`${styles.drawer} ${styles.left}`} role="dialog">
      {children}
    </div>
    <div
      className={styles.backdrop}
      onClick={onClose}
      onKeyDown={onClose}
      role="button"
      aria-label="Close drawer"
      tabIndex={0}
    />
  </div>
);

export default Drawer;

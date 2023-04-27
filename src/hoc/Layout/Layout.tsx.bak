import * as React from "react";
import { FunctionComponent } from "react";

import styles from "./Layout.module.scss";
// import PadList from "../../components/PadList/PadList";
import MyHeader from "../../components/MyHeader/MyHeader";

const Layout: FunctionComponent<{ home: boolean }> = ({ home, children }) => {
  return (
    <main className={styles.content}>
      <MyHeader home={home} />
      {children}
    </main>
  );
};

export default Layout;

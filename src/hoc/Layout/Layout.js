import React from "react";

import styles from "./Layout.module.scss";
// import PadList from "../../components/PadList/PadList";
import MyHeader from "../../components/MyHeader/MyHeader";

const Layout = (props) => {
  return (
    <main className={styles.content}>
      <MyHeader home={props.home} />
      {props.children}
    </main>
  );
};

export default Layout;

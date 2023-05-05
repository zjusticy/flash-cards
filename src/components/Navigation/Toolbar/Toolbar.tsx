import * as React from "react";

import styles from "./Toolbar.module.scss";
import SearchBar from "../../SerachBar/SearchBar";

const Toolbar = () => (
  <div className={styles.Toolbar}>
    <SearchBar />
  </div>
);

export default Toolbar;

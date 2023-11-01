import * as React from "react";

import SearchBar from "features/ui/search-bar/search-bar";
import styles from "./toolbar.module.scss";

const Toolbar = () => (
  <div className={styles.Toolbar}>
    <SearchBar />
  </div>
);

export default Toolbar;

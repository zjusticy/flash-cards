import React from "react";

import classes from "./Backdrop.module.scss";

const backdrop = (props) =>
  props.show ? (
    <div
      className={classes.Backdrop}
      onClick={props.clicked}
      role="button"
      aria-label="close Modal"
      tabIndex={0}
    />
  ) : null;

export default backdrop;

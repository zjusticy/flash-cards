import * as React from "react";
import { FunctionComponent } from "react";

import classes from "./Backdrop.module.scss";

const backdrop: FunctionComponent<{ show: boolean; clicked: () => void }> = ({
  show,
  clicked,
}) =>
  show ? (
    <div
      className={classes.Backdrop}
      onClick={clicked}
      onKeyDown={() => {}}
      role="button"
      aria-label="close Modal"
      tabIndex={0}
    />
  ) : null;

export default backdrop;

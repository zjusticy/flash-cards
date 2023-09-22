import * as React from "react";
import { FunctionComponent } from "react";

import classes from "./backdrop.module.scss";

const Backdrop: FunctionComponent<{ show: boolean; clicked: () => void }> = ({
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

export default Backdrop;

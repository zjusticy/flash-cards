import React from "react";
import PropTypes from "prop-types";

import styles from "./InputCombine.module.scss";

const inputCombine = (props) => (
  <div className={styles.newNameWrap}>
    <label htmlFor={props.name}>{props.tag}</label>
    <input
      name={props.name}
      value={props.listName}
      type={props.type || "text"}
      onChange={props.inputChangedHandler}
    />
  </div>
);

export default inputCombine;

inputCombine.propTypes = {
  name: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  inputChangedHandler: PropTypes.func.isRequired,
};

import React from "react";
import PropTypes from "prop-types";

import styles from "./NavigationItems.module.scss";
// import NavigationItem from './NavigationItem/NavigationItem';
import Button from "../../UI/Button/Button";

const NavigationItems = (props) => {
  return (
    <ul className={styles.NavigationItems}>
      <li>
        <Button
          type="button"
          clicked={props.onDoubleSwitch}
          elementType="normal"
        >
          {props.mode ? "Double" : "Single"}
        </Button>
      </li>
      <li>
        <Button type="button" clicked={props.todo} elementType="normal">
          Delete
        </Button>
      </li>
    </ul>
  );
};

export default NavigationItems;

NavigationItems.propTypes = {
  onDoubleSwitch: PropTypes.func.isRequired,
  mode: PropTypes.bool.isRequired,
  todo: PropTypes.func.isRequired,
};

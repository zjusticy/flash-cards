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
          {props.modeS ? "Double" : "Single"}
        </Button>
      </li>
      <li>
        <Button
          type="button"
          clicked={props.onDoubleEditSwitch}
          elementType="normal"
        >
          {props.modeE ? "DEdit" : "SEdit"}
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
  modeS: PropTypes.bool.isRequired,
  todo: PropTypes.func.isRequired,
};

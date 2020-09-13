import * as React from "react";

import styles from "./NavigationItems.module.scss";
// import NavigationItem from './NavigationItem/NavigationItem';
import Button from "../../UI/Button/Button";

type Props = {
  onDoubleSwitch: () => void;
  modeS: boolean;
  modeE: boolean;
  onDoubleEditSwitch: () => void;
  todo: () => void;
};

const NavigationItems = ({
  onDoubleSwitch,
  modeS,
  modeE,
  onDoubleEditSwitch,
  todo,
}: Props) => {
  return (
    <ul className={styles.NavigationItems}>
      <li>
        <Button clicked={onDoubleSwitch} elementType="normal">
          {modeS ? "Double" : "Single"}
        </Button>
      </li>
      <li>
        <Button clicked={onDoubleEditSwitch} elementType="normal">
          {modeE ? "DEdit" : "SEdit"}
        </Button>
      </li>
      <li>
        <Button clicked={todo} elementType="normal">
          Delete
        </Button>
      </li>
    </ul>
  );
};

export default NavigationItems;

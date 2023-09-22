import * as React from "react";
import Button from "features/ui/button/button";

import styles from "./navigation-items.module.scss";
// import NavigationItem from './NavigationItem/NavigationItem';

type Props = {
  // onDoubleSwitch: () => void;
  // modeS: boolean;
  // modeE: boolean;
  // onDoubleEditSwitch: () => void;
  todo: () => void;
  logout: () => void;
};

const NavigationItems = ({
  // onDoubleSwitch,
  // modeS,
  // modeE,
  // onDoubleEditSwitch,
  todo,
  logout,
}: Props) => (
  <ul className={styles.NavigationItems}>
    <li>
      <Button clicked={todo} elementType="normal">
        Delete
      </Button>
    </li>
    <li>
      <Button clicked={logout} elementType="normal">
        Log out
      </Button>
    </li>
  </ul>
);

export default NavigationItems;

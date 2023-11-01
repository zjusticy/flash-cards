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
  signin: () => void;
  localDB: boolean;
  branch: boolean;
};

const NavigationItems = ({
  // onDoubleSwitch,
  // modeS,
  // modeE,
  branch,
  signin,
  localDB,
  todo,
  logout,
}: Props) => (
  <ul className={styles.NavigationItems}>
    {branch && (
      <li>
        <Button clicked={todo} elementType="normal">
          Delete
        </Button>
      </li>
    )}
    <li>
      <Button clicked={localDB ? signin : logout} elementType="normal">
        {localDB ? "Sign in" : "Log out"}
      </Button>
    </li>
  </ul>
);

export default NavigationItems;

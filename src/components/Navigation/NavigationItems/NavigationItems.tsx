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
  logout: () => void;
};

const NavigationItems = ({
  onDoubleSwitch,
  modeS,
  modeE,
  onDoubleEditSwitch,
  todo,
  logout,
}: Props) => {
  return (
    <ul className={styles.NavigationItems}>
      {/* <li>
        <Button clicked={onDoubleSwitch} elementType="normal">
          {modeS ? "Double" : "Single"}
        </Button>
      </li>
      <li>
        <Button clicked={onDoubleEditSwitch} elementType="normal">
          {modeE ? "DEdit" : "SEdit"}
        </Button>
      </li> */}
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
};

export default NavigationItems;

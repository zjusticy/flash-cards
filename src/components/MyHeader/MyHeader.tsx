import { useState, useEffect, useRef } from "react";
import * as React from "react";

import { useHistory } from "react-router-dom";

import cardsLogo from "../../assets/images/title_pic_2.png";
import homeLogo from "../../assets/images/home_pic.png";
import backLogo from "../../assets/images/back_pic.png";
import LogOutLogo from "../../assets/images/logOut";
// import NavToggleButton from "../UI/NavToggleButton/NavToggleButton";
import NavigationItems from "../Navigation/NavigationItems/NavigationItems";

import styles from "./MyHeader.module.scss";

import useAuth from "../../hooks/useAuth";
import useCards from "../../hooks/useCards";
import MoreLogo from "../../assets/images/menu";
import { Settings } from "../../types";

type Props = {
  home: boolean;
};

const MyHeader = ({ home }: Props) => {
  const [inputClasses, changeClasses] = useState<string[]>([styles.menu]);

  const [toggleShow, toggle] = useState<boolean>(false);

  const { onLogout } = useAuth();

  const history = useHistory();

  const { modeE, modeS, onModeFlip, onEditModeFlip } = useCards();

  const node = useRef<HTMLDivElement>(null);

  // Handle the click outside the dropdown button and menu
  const handleOtherClick = (e: MouseEvent) => {
    if (node.current && node.current.contains(e.target as Element)) {
      // inside click
      return;
    }
    // outside click
    changeClasses([styles.menu]);
    toggle(false);
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleOtherClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleOtherClick);
    };
  }, []);

  useEffect(() => {
    const value: Settings = { modeSingleBoard: modeS, modeSingleUpdate: modeE };
    window.localStorage.setItem("Settings", JSON.stringify(value));
  }, [modeS, modeE]);

  const toggleClikedhandler = () => {
    if (!toggleShow) {
      changeClasses([styles.menu, styles.active]);
      toggle(!toggleShow);
    } else {
      changeClasses([styles.menu]);
      toggle(!toggleShow);
    }
  };

  const doubleSwich = () => {
    onModeFlip();
    toggleClikedhandler();
  };

  const doubleEditSwich = () => {
    onEditModeFlip();
    toggleClikedhandler();
  };

  const goHome = () => {
    history.push("/");
  };

  const goBack = () => {
    history.goBack();
  };

  const headStyle = home
    ? `${styles.container} ${styles.extraPadding}`
    : `${styles.container}`;

  return (
    <header className={styles.myHeader}>
      <div className={headStyle}>
        <nav className={styles.buttonHolder}>
          <div className={styles.buttonHeader}>
            <button type="button" onClick={goBack}>
              <img src={backLogo} alt="Go Back" />
            </button>
          </div>
          <div className={styles.buttonHeader}>
            <button type="button" onClick={goHome}>
              <img src={homeLogo} alt="Home Page" />
            </button>
          </div>
          <div className={styles.buttonHeader}>
            <button type="button" onClick={onLogout}>
              <LogOutLogo alt="Home Page" />
            </button>
          </div>
          <div className={styles.buttonHeaderSecond} ref={node}>
            <button type="button" onClick={toggleClikedhandler}>
              <MoreLogo alt="navDrawer" />
            </button>
            <div className={inputClasses.join(" ")}>
              <NavigationItems
                onDoubleSwitch={doubleSwich}
                onDoubleEditSwitch={doubleEditSwich}
                modeS={modeS}
                modeE={modeE}
                todo={toggleClikedhandler}
              />
            </div>
          </div>
        </nav>
        <div className={styles.imageHolder}>
          <img src={cardsLogo} alt="Tom's Cards" />
        </div>
      </div>
    </header>
  );
};

// export default withRouter(MyHeader);
export default MyHeader;

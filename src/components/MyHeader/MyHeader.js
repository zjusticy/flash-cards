import React, { useState, useEffect, useRef } from "react";

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

const MyHeader = (props) => {
  const [inputClasses, changeClasses] = useState([styles.menu]);

  const [toggleShow, toggle] = useState(false);

  const { onLogout } = useAuth();

  const history = useHistory();

  const { modeE, modeS, onModeFlip, onEditModeFlip } = useCards();

  const node = useRef();

  // Handle the click outside the dropdown button and menu
  const handleOtherClick = (e) => {
    if (node.current.contains(e.target)) {
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

  const headStyle = props.home
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

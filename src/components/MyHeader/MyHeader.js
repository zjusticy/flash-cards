import React, { useState } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import cardsLogo from "../../assets/images/title_pic_2.png";
import homeLogo from "../../assets/images/home_pic.png";
import backLogo from "../../assets/images/back_pic.png";
import LogOutLogo from "../../assets/images/logOut";
// import NavToggleButton from "../UI/NavToggleButton/NavToggleButton";
import NavigationItems from "../Navigation/NavigationItems/NavigationItems";

import styles from "./MyHeader.module.scss";

import { modeFlip } from "../../store/cards";
import { signOut } from "../../store/auth";
import MoreLogo from "../../assets/images/menu";

const MyHeader = (props) => {
  const { onModeFlip, onLogout, modeS } = props;

  const [inputClasses, changeClasses] = useState([styles.menu]);

  const [toggleShow, toggle] = useState(false);

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

  const goHome = () => {
    props.history.push("/");
  };

  const goBack = () => {
    props.history.goBack();
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
          <div className={styles.buttonHeaderSecond}>
            <button type="button" onClick={toggleClikedhandler}>
              <MoreLogo alt="navDrawer" />
            </button>
            <div className={inputClasses.join(" ")}>
              <NavigationItems
                onDoubleSwitch={doubleSwich}
                mode={modeS}
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

const mapStateToProps = (state) => {
  return {
    modeS: state.cards.modeS,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModeFlip: () => {
      dispatch(modeFlip());
    },
    onLogout: () => dispatch(signOut()),
  };
};

// export default withRouter(MyHeader);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MyHeader));

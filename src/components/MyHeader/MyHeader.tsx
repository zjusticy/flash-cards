import { useState, useEffect, useRef } from "react";
import * as React from "react";

import { useNavigate, useLocation, matchRoutes } from "react-router-dom";

// import cardsLogo from "../../assets/images/title_pic_2.png";
import homeLogo from "../../assets/images/home_pic.png";
import backLogo from "../../assets/images/back_pic.png";
// import LogOutLogo from "../../assets/images/logOut";
// import NavToggleButton from "../UI/NavToggleButton/NavToggleButton";
import NavigationItems from "../Navigation/NavigationItems/NavigationItems";

import styles from "./MyHeader.module.scss";

import { useGlobalContext } from "../../store/store";
// import useCards from "../../hooks/useCards.ts.bak";
import MoreLogo from "../../assets/images/menu";
import BeaverLogo from "../../assets/images/beaver";
import { Settings } from "../../types";
import useWindowSize from "../../hooks/useWindowSize";

// type Props = {
//   home: boolean;
// };

const routes = [{ path: "/cardCreator/:name" }];

const MyHeader = () => {
  const [inputClasses, changeClasses] = useState<string[]>([styles.menu]);

  const [toggleShow, toggle] = useState<boolean>(false);

  const {
    setAuthState,
    modeE,
    modeS,
    // setModeE,
    // setModeS,
    drawerVisible,
    setDrawerVisibility,
  } = useGlobalContext();

  const navigate = useNavigate();

  const windowSize = useWindowSize();

  const location = useLocation();

  const branch = matchRoutes(routes, location);

  const withinSize = windowSize?.width && windowSize?.width < 640;

  // const { modeE, modeS, onModeFlip, onEditModeFlip } = useCards();

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

  // const doubleSwich = () => {
  //   setModeE(!modeE);
  //   toggleClikedhandler();
  // };

  // const doubleEditSwich = () => {
  //   setModeS(!modeS);
  //   toggleClikedhandler();
  // };

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const changeCardsListVis = () => {
    setDrawerVisibility(!drawerVisible);
  };

  // const headStyle = home
  //   ? `${styles.container} ${styles.extraPadding}`
  //   : `${styles.container}`;

  const headStyle = `${styles.container} ${styles.extraPadding}`;

  return (
    <header className={styles.myHeader}>
      <div className={headStyle}>
        <nav className={styles.buttonHolder}>
          <div className={styles.buttonHeader}>
            <button type="button" onClick={goBack}>
              <img
                src={backLogo}
                alt="Go Back"
                height={withinSize ? "32" : "null"}
                width={withinSize ? "32" : "null"}
              />
            </button>
          </div>
          <div className={styles.buttonHeader}>
            <button type="button" onClick={goHome}>
              <img
                src={homeLogo}
                alt="Home Page"
                height={withinSize ? "32" : "null"}
                width={withinSize ? "32" : "null"}
              />
            </button>
          </div>
          {/* <div className={styles.buttonHeader}>
            <button type="button" onClick={() => setAuthState(false)}>
              <LogOutLogo alt="Home Page" />
            </button>
          </div> */}
          <div className={styles.buttonHeaderSecond} ref={node}>
            <button type="button" onClick={toggleClikedhandler}>
              <MoreLogo
                alt="navDrawer"
                height={withinSize ? "32" : "53"}
                // width={withinSize ? "32" : "null"}

                // width = "10",
                // height = "53",
              />
            </button>
            <div className={inputClasses.join(" ")}>
              <NavigationItems
                // onDoubleSwitch={doubleSwich}
                // onDoubleEditSwitch={doubleEditSwich}
                // modeS={modeS}
                // modeE={modeE}
                todo={toggleClikedhandler}
                logout={() => setAuthState(false)}
              />
            </div>
          </div>
        </nav>
        {/* <div className={styles.imageHolder}> */}
        {/* <img src={cardsLogo} alt="Tom's Cards" /> */}
        {branch && (
          <div className={styles.buttonHeader}>
            <button type="button" onClick={changeCardsListVis}>
              <BeaverLogo
                alt="Cards list"
                height={withinSize ? "32" : "58"}
                width={withinSize ? "29" : "50"}
              />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// export default withRouter(MyHeader);
export default MyHeader;

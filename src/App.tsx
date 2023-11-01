import { useEffect, useState } from "react";
import * as React from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { MyHeader, Spinner } from "features/ui";

import useAuthCheck from "features/user/use-auth-check";
import { CardUpdate, MemoryBoard, Intro, Auth } from "pages";
import styles from "App.module.scss";
// import AddCard from "./containers/AddCard/AddCard";
import { MyGlobalContext } from "store/store";
import { Settings } from "types";

const RequireAuth = ({ isAuth }: { isAuth: boolean }) => {
  if (!isAuth) {
    return <Navigate to={{ pathname: "/login" }} replace />;
  }

  return (
    <main className={styles.content}>
      <MyHeader />
      <Outlet />
    </main>
  );
};
function BasicLayout() {
  return <Outlet />;
}

function LocalLayout() {
  return (
    <main className={styles.content}>
      <MyHeader localDB />
      <Outlet />
    </main>
  );
}

const App = () => {
  // componentWillMount() {
  //   localStorage.setItem('myName', 'Tom');
  // }
  const { isLoading } = useAuthCheck();

  const [isAuth, setAuthState] = useState<boolean>(false);
  const [modeS, setModeS] = useState<boolean>(true);
  const [modeE, setModeE] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisibility] = useState<boolean>(true);
  const [useLocalDB, setUseLocalDB] = useState<boolean>(false);
  // const [cardsCache, setCardsCache] = useImmer<CardsCacheType>({});
  // const [sortedIds, setSortedIds] = useImmer<Array<string>>([]);
  // const [activeListName, setActiveListName] = useState<string>("");
  // const [activeId, setActiveId] = useState<string | null>(null);
  // const [cardsData, setCardsData] = useImmer<CardsDataType>({
  //   cardsCache: {},
  //   sortedIds: [],
  //   // activeListName: "",
  //   activeId: null,
  // });

  // const { onModeInit } = useCards();

  useEffect(() => {
    const stickyValue = window.localStorage.getItem("Settings");
    if (stickyValue !== null) {
      const localSettings: Settings = JSON.parse(stickyValue);

      setModeS(localSettings.modeSingleUpdate);
      setModeE(localSettings.modeSingleBoard);
    }
  }, []);

  // useEffect(() => {
  //   if (!isAuth) {
  //     redirect("/login");
  //   }
  // }, [isAuth]);

  // let routes = this.props.isWaiting || this.props.isAuthenticated ? (
  const routes = (
    <Routes>
      <Route path="/" element={<RequireAuth isAuth={isAuth} />}>
        <Route path="/memoryBoard/:name" element={<MemoryBoard />} />
        <Route path="/cardCreator/:name" element={<CardUpdate />} />
        <Route path="/intro" element={<Intro />} />
        <Route index element={<Intro />} />
      </Route>
      {/* <redirect to="/intro" /> */}
      <Route path="/login" element={<BasicLayout />}>
        <Route index element={<Auth />} />
      </Route>
      <Route path="/local" element={<LocalLayout />}>
        <Route path="/local/intro" element={<Intro localDB />} />
        <Route
          path="/local/memoryBoard/:name"
          element={<MemoryBoard localDB />}
        />
        <Route
          path="/local/cardCreator/:name"
          element={<CardUpdate localDB />}
        />
      </Route>

      {/* <redirect to="/login" /> */}
    </Routes>
  );

  const mainPage = isLoading ? (
    <div className={styles.marginTop}>
      <Spinner />
    </div>
  ) : (
    <MyGlobalContext.Provider
      value={{
        isAuth,
        setAuthState,
        modeS,
        setModeS,
        modeE,
        setModeE,
        drawerVisible,
        setDrawerVisibility,
        useLocalDB,
        setUseLocalDB,
      }}
    >
      {routes}
    </MyGlobalContext.Provider>
  );

  return mainPage;
};

export default App;

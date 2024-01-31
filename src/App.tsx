// import { useEffect, useState } from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { Spinner } from "@/features/ui";
import MyHeader from "@/features/layout/my-header/my-header";

import useAuthCheck from "@/features/user/use-auth-check";
import { CardUpdate, MemoryBoard, Intro, Auth } from "@/pages";
// import { Settings } from "@/types";
import { useCardStore } from "@/store/zustand";

const RequireAuth = ({
  isAuth,
  isLoading,
}: {
  isAuth: boolean;
  isLoading: boolean;
}) => {
  if (!isLoading && !isAuth) {
    return <Navigate to={{ pathname: "/login" }} replace />;
  }

  return isLoading ? (
    <div className="mt-40">
      <Spinner />
    </div>
  ) : (
    <div className="flex flex-col h-full">
      <MyHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
function BasicLayout() {
  return <Outlet />;
}

function LocalLayout() {
  return (
    <div className="flex flex-col h-full">
      <MyHeader localDB={true} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

const App = () => {
  // componentWillMount() {
  //   localStorage.setItem('myName', 'Tom');
  // }
  const { isLoading } = useAuthCheck();

  const { isAuth } = useCardStore();

  //   useEffect(() => {
  //     const stickyValue = window.localStorage.getItem("Settings");
  //     if (stickyValue !== null) {
  //       const localSettings: Settings = JSON.parse(stickyValue);

  //       setModeS(localSettings.modeSingleUpdate);
  //       setModeE(localSettings.modeSingleBoard);
  //     }
  //   }, []);

  // let routes = this.props.isWaiting || this.props.isAuthenticated ? (
  const routes = (
    <Routes>
      <Route
        path="/"
        element={<RequireAuth isAuth={isAuth} isLoading={isLoading} />}
      >
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

  const mainPage = <>{routes}</>;

  return mainPage;
};

export default App;

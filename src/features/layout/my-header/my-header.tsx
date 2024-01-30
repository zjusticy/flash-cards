import { useState, useEffect, useRef } from "react";

import { useLocation, matchRoutes, useNavigate } from "react-router-dom";

import { useCardStore } from "@/store/zustand";
import useWindowSize from "@/utils/useWindowSize";
import MoreLogo from "@/assets/images/menu";
import BeaverLogo from "@/assets/images/beaver";
import { Settings } from "@/types";
import NavigationItems from "@/features/layout/navigation-items/navigation-items";
import { cn } from "@/utils/mergeClasses";
import useAuth from "@/features/user/use-auth";

// const isCreateCardPath = (path: string) => {
//   const pwd = /.*\/cardCreator\/.*/;
//   return pwd.test(path);
// };

const routes = [
  { path: "/cardCreator/:name" },
  { path: "/local/cardCreator/:name" },
];

const MyHeader = ({ localDB = false }: { localDB?: boolean }) => {
  const [inputClasses, changeClasses] = useState<string[]>([
    "absolute \
   left-[-1px] top-[100px] scale-0 z-[20] opacity-0 [&>ul]:leading-[3rem]",
  ]);

  const [toggleShow, toggle] = useState<boolean>(false);

  const { modeE, modeS, drawerVisible, setDrawerVisibility } = useCardStore();

  const { signOutHandler } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const windowSize = useWindowSize();

  const branch = matchRoutes(routes, location);

  const withinSize = windowSize?.width && windowSize?.width < 640;

  const node = useRef<HTMLDivElement>(null);

  // Handle the click outside the dropdown button and menu
  const handleOtherClick = (e: MouseEvent) => {
    if (node.current && node.current.contains(e.target as Element)) {
      // inside click
      return;
    }
    // outside click
    changeClasses([
      "absolute left-[-1px] top-[100px] \
       scale-0 z-[20] opacity-0 [&>ul]:leading-[3rem]",
    ]);
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
      changeClasses([
        "absolute left-[-1px] top-[100px] \
      scale-0 z-[20] opacity-0 [&>ul]:leading-[3rem]",
        "scale-100 duration-[250ms] opacity-100",
      ]);
      toggle(!toggleShow);
    } else {
      changeClasses([
        "absolute left-[-1px] top-[100px] \
      scale-0 z-[20] opacity-0 [&>ul]:leading-[3rem]",
      ]);
      toggle(!toggleShow);
    }
  };

  const goHome = () => {
    if (localDB) {
      navigate("/local/intro");
      return;
    }
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const toSignInPage = () => {
    navigate("/login");
  };

  const changeCardsListVis = () => {
    setDrawerVisibility(!drawerVisible);
  };

  return (
    <header
      className="w-full border-b border-solid border-gray-400 \
    shadow-[0_2px_2px_#ccc] box-border relative"
    >
      <div className="flex justify-between my-0 mx-auto w-full max-w-[1080px]">
        <nav
          className="h-[50px] flex border-l border-solid border-gray-100 \ 
        md:h-[100px]"
        >
          <div
            className="border-r border-solid border-gray-200 leading-[50px] w-[50px] \
          duration-100 box-border md:w-[100px] md:leading-[100px]"
          >
            <button
              type="button"
              onClick={goBack}
              className={cn(
                "outline-none w-full h-full hover:cursor-pointer \
               hover:border-[3px] hover:border-gray-400 active:border-3 active:border-gray-400",
                "flex justify-center items-center [&_svg]:block"
              )}
            >
              <img
                src="/images/back_pic.png"
                alt="Go Back"
                height={withinSize ? "32" : "null"}
                width={withinSize ? "32" : "null"}
                className="align-middle"
              />
            </button>
          </div>
          <div
            className="border-r border-solid border-gray-200 leading-[50px] w-[50px] \
          duration-100 box-border md:w-[100px] md:leading-[100px]"
          >
            <button
              type="button"
              onClick={goHome}
              className={cn(
                "outline-none w-full h-full hover:cursor-pointer \
                hover:border-[3px] hover:border-gray-400 active:border-[3px] active:border-gray-400",
                "flex justify-center items-center [&_svg]:block"
              )}
            >
              <img
                src="/images/home_pic.png"
                alt="Home Page"
                height={withinSize ? "32" : "null"}
                width={withinSize ? "32" : "null"}
                className="align-middle"
              />
            </button>
          </div>
          <div
            className={cn(
              "border-r border-solid border-gray-200 leading-[50px] w-[50px] \
          duration-100 box-border md:w-[100px] md:leading-[100px]",
              "relative"
            )}
            ref={node}
          >
            <button
              className="outline-none w-full h-full hover:cursor-pointer flex justify-center items-center \
              hover:border-[3px] hover:border-gray-400 active:border-[3px] active:border-gray-400"
              type="button"
              onClick={toggleClikedhandler}
            >
              <MoreLogo alt="navDrawer" height={withinSize ? "32" : "53"} />
            </button>
            <div className={inputClasses.join(" ")}>
              <NavigationItems
                branch={Boolean(branch)}
                signin={toSignInPage}
                localDB={localDB}
                todo={toggleClikedhandler}
                logout={() => {
                  signOutHandler();
                }}
              />
            </div>
          </div>
        </nav>
        {branch && (
          <div
            className="border-r-[1px_solid_rgba(0, 0, 0, 0.1)] leading-[50px] w-[50px] \
          duration-100 box-border md:w-[100px] md:leading-[100px]"
          >
            <button
              type="button"
              onClick={changeCardsListVis}
              className={cn(
                "outline-none w-full h-full hover:cursor-pointer \
               hover:boder-[3px_solid_rgba(0, 0, 0, 0.3)] active:boder-[3px_solid_rgba(0, 0, 0, 0.3)]",
                "flex justify-center items-center [&_svg]:block"
              )}
            >
              <BeaverLogo
                alt="Cards list"
                height={withinSize ? "32" : "58"}
                width={withinSize ? "29" : "50"}
                className="align-middle"
              />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MyHeader;

import { useState, useEffect } from "react";

type WindowType = {
  width: number | undefined;
  height: number | undefined;
};

// export default function useWindowSize(targetWidth: number) {
export default function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<WindowType>({
    width: undefined,
    height: undefined,
  });

  // const [withinSize, setSizeStatus] = useState<Boolean>(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      // setWindowSize({
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      // });
      setWindowSize({
        width: window.screen.width,
        height: window.screen.height,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

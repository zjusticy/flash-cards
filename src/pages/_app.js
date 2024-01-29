// import { useEffect } from "react";
import Head from "next/head";

import "@/style/global.css";
// import { useCardStore } from "@/store/zustand";

// import Head from "next/head";
import "katex/dist/katex.min.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  // const { setModeS, setModeE } = useCardStore();

  // useEffect(() => {
  //   const stickyValue = window.localStorage.getItem("Settings");
  //   if (stickyValue !== null) {
  //     const localSettings = JSON.parse(stickyValue);

  //     setModeS(localSettings.modeSingleUpdate);
  //     setModeE(localSettings.modeSingleBoard);
  //   }
  // }, []);

  return (
    <>
      <Head>
        <title>Memory Cards</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

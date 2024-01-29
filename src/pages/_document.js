import React from "react";
import Document, { Head, Main, NextScript, Html } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/png" href="/images/favicon.png" />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <link rel="shortcut icon" href="/images/favicon.png" />
          <link rel="manifest" href="manifest.json" />
          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

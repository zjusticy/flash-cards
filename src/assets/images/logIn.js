import React from "react";

const LogIn = ({
  style = {},
  fill = "#000",
  width = "52",
  height = "61",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 127 146",
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    aria-hidden={ariaHidden}
    fill={fill}
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="65" width="20" height="20" fill="black" />
    <rect x="86" width="20" height="20" fill="black" />
    <rect x="107" y="21" width="20" height="20" fill="black" />
    <rect x="107" y="42" width="20" height="20" fill="black" />
    <rect x="107" y="63" width="20" height="20" fill="black" />
    <rect x="107" y="84" width="20" height="20" fill="black" />
    <rect x="107" y="105" width="20" height="20" fill="black" />
    <rect x="86" y="126" width="20" height="20" fill="black" />
    <rect x="65" y="126" width="20" height="20" fill="black" />
    <rect y="41" width="20" height="20" fill="black" />
    <rect x="21" y="62" width="20" height="20" fill="black" />
    <rect y="83" width="20" height="20" fill="black" />
  </svg>
);

export default LogIn;

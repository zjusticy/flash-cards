import * as React from "react";
import { FunctionComponent } from "react";

type Props = {
  style?: any;
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
  ariaHidden?: boolean;
  viewBox?: string;
  role?: string;
  alt: string;
};

const CardFlip: FunctionComponent<Props> = ({
  style = {},
  fill = "#000",
  width = "25",
  height = "25",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 50 50",
  role = "image",
  alt,
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    aria-hidden={ariaHidden}
    fill={fill}
    aria-labelledby={alt}
    role={role}
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 20 4 C 14.507813 4 10 8.507813 10 14 L 10 31.75 L 7.125 28.875 L 4.3125 31.71875 L 12 39.40625 L 19.6875 31.71875 L 16.875 28.90625 L 14 31.75 L 14 14 C 14 10.691406 16.691406 8 20 8 L 31 8 L 31 4 Z M 38 10.59375 L 30.28125 18.3125 L 33.125 21.125 L 36 18.25 L 36 36 C 36 39.308594 33.308594 42 30 42 L 19 42 L 19 46 L 30 46 C 35.492188 46 40 41.492188 40 36 L 40 18.25 L 42.875 21.125 L 45.6875 18.28125 Z" />
  </svg>
);

export default CardFlip;

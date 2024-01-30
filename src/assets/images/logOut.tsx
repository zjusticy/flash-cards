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

const LogOut: FunctionComponent<Props> = ({
  style = {},
  fill = "#000",
  width = "52",
  height = "61",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 127 146",
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
    <rect x="65" width="20" height="20" fill="black" />
    <rect x="86" width="20" height="20" fill="black" />
    <rect x="107" y="21" width="20" height="20" fill="black" />
    <rect x="107" y="42" width="20" height="20" fill="black" />
    <rect x="107" y="63" width="20" height="20" fill="black" />
    <rect x="107" y="84" width="20" height="20" fill="black" />
    <rect x="107" y="105" width="20" height="20" fill="black" />
    <rect x="86" y="126" width="20" height="20" fill="black" />
    <rect x="65" y="126" width="20" height="20" fill="black" />
    <rect x="21" y="41" width="20" height="20" fill="black" />
    <rect y="62" width="20" height="20" fill="black" />
    <rect x="21" y="83" width="20" height="20" fill="black" />
  </svg>
);

export default LogOut;

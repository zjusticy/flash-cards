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

const Menu: FunctionComponent<Props> = ({
  style = {},
  fill = "#000",
  width = "10",
  height = "53",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 20 104",
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
    <rect width="20" height="20" fill="black" />
    <rect y="84" width="20" height="20" fill="black" />
    <rect y="42" width="20" height="20" fill="black" />
  </svg>
);

export default Menu;

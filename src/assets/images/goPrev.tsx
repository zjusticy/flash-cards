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

const GoPrev: FunctionComponent<Props> = ({
  style = {},
  fill = "#81A3C0",
  width = "70",
  height = "70",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 100 100",
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
    <rect x="40" width="20" height="20" fill={fill} />
    <rect y="40" width="20" height="20" fill={fill} />
    <rect x="40" y="80" width="20" height="20" fill={fill} />
    <rect x="20" y="60" width="20" height="20" fill={fill} />
    <rect x="20" y="20" width="20" height="20" fill={fill} />
    <rect x="80" y="40" width="20" height="20" fill={fill} />
  </svg>
);

export default GoPrev;

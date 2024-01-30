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

const FileIcon: FunctionComponent<Props> = ({
  style = {},
  fill = "#FCE38D",
  width = "70",
  height = "70",
  className = "",
  ariaHidden = true,
  viewBox = "0 0 256 256",
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
    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
    <g>
      <g>
        <g>
          <path
            fill={fill}
            d="M56.3,10.4C44.6,11.9,32,21.1,26.7,31.9c-4.3,9-4.1,2.6-4.1,96.1c0,93.5-0.2,87.1,4.1,96.1c1.9,3.9,3.3,5.9,7.4,9.8c4.1,4.2,5.8,5.5,10.4,7.7c9.3,4.5,7.6,4.4,65.4,4.3l50.6-0.2l3.2-1.6c4.6-2.4,66-63.8,68-68.1l1.4-2.9l0.2-64.4c0.2-72.1,0.3-68-4-77c-1.9-3.9-3.5-5.9-7.4-9.8c-4.1-4.1-5.8-5.4-10.4-7.7c-9.4-4.6-5.4-4.4-84-4.3C89.3,10.1,57.3,10.2,56.3,10.4z M202.3,30.2c4.4,2.1,8.1,5.6,10.4,9.8l2,3.6l0.2,60.6l0.1,60.6h-19.8c-12.6,0-21,0.2-22.9,0.6c-7.5,1.6-14.1,6.8-17.3,13.6l-1.8,3.9l-0.2,22.3l-0.2,22.3l-47.6-0.1l-47.6-0.2l-3.2-1.3c-4.4-1.8-8.6-5.6-11-10.1l-2-3.6l-0.2-83.1c-0.1-53.3,0.1-83.9,0.5-85.2c1.7-6.2,7.7-12.4,13.9-14.5c3.6-1.2,5.1-1.2,73.6-1l70,0.1L202.3,30.2z M183.3,195.7l-24.5,24.5l-0.2-16.5c-0.2-18.5,0.2-20.6,3.5-25c2.1-2.8,6.4-5.9,9.3-6.7c1-0.3,9.6-0.6,19.1-0.6l17.3-0.1L183.3,195.7z"
          />
          <path
            fill={fill}
            d="M72.5,85.7c-1.2,1.2-1.2,2.8,0,3.9c0.8,0.8,6.6,0.9,55.5,0.9s54.7-0.1,55.5-0.9c0.5-0.5,0.9-1.4,0.9-2c0-0.6-0.4-1.5-0.9-2c-0.8-0.8-6.6-0.9-55.5-0.9S73.3,84.9,72.5,85.7z"
          />
          <path
            fill={fill}
            d="M72.6,111.8c-1.3,1.5-1.2,3.3,0.3,4.4c1.2,0.8,7.4,0.9,55.3,0.9c53.3,0,54,0,55.2-1.2c1.4-1.4,1.5-3,0.1-4.2c-1-0.9-5.6-1-55.5-1C75.9,110.7,73.4,110.8,72.6,111.8z"
          />
          <path
            fill={fill}
            d="M72.2,138.3c-0.9,1.6-0.7,2.6,0.5,3.7c1,0.9,4.3,1,36.6,1h35.5l0.9-1.4c0.9-1.3,0.9-1.6,0-2.9l-0.9-1.4h-36C73.8,137.2,72.7,137.3,72.2,138.3z"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default FileIcon;

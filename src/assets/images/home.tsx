import { FunctionComponent } from 'react';

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

const Home: FunctionComponent<Props> = ({
  style = {},
  fill = '#000',
  width = '53',
  height = '53',
  className = '',
  ariaHidden = true,
  viewBox = '0 0 146 146',
  role = 'image',
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
    className={`svg-icon ${className || ''}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="126" y="84" width="20" height="20" fill="black" />
    <rect x="42" y="126" width="20" height="20" fill="black" />
    <rect x="42" y="21" width="20" height="20" fill="black" />
    <rect x="84" y="21" width="20" height="20" fill="black" />
    <rect x="105" y="42" width="20" height="20" fill="black" />
    <rect x="126" y="105" width="20" height="20" fill="black" />
    <rect x="126" y="63" width="20" height="20" fill="black" />
    <rect y="84" width="20" height="20" fill="black" />
    <rect y="105" width="20" height="20" fill="black" />
    <rect y="63" width="20" height="20" fill="black" />
    <rect x="84" y="126" width="20" height="20" fill="black" />
    <rect x="63" width="20" height="20" fill="black" />
    <rect x="105" y="126" width="20" height="20" fill="black" />
    <rect x="21" y="42" width="20" height="20" fill="black" />
    <rect x="21" y="126" width="20" height="20" fill="black" />
    <rect x="63" y="126" width="20" height="20" fill="black" />
  </svg>
);

export default Home;

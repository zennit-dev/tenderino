import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const ClockIcon = ({ ...props }: IconProps) => {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" {...props}>
      <g>
        <path
          d="M1 9C1 4.58179 4.58179 1 9 1C13.4182 1 17 4.58179 17 9C17 13.4182 13.4182 17 9 17C4.58179 17 1 13.4182 1 9Z"
          fillOpacity=".4"
          fillRule="evenodd"
        />
        <path
          d="M9 4C9.41421 4 9.75 4.33579 9.75 4.75V8.60704L12.6769 10.6334C13.0175 10.8691 13.1024 11.3363 12.8666 11.6769C12.6309 12.0175 12.1637 12.1024 11.8231 11.8666L8.57309 9.61664C8.37074 9.47656 8.25 9.24611 8.25 9V4.75C8.25 4.33579 8.58579 4 9 4Z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

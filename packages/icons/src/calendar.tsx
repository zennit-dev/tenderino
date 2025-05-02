import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const CalendarIcon = ({ ...props }: IconProps) => (
  <svg height="18" width="18" viewBox="0 0 18 18" {...props}>
    <g fill="#212121">
      <path
        d="M2.25 4.75C2.25 3.64543 3.14543 2.75 4.25 2.75H13.75C14.8546 2.75 15.75 3.64543 15.75 4.75V6.25H2.25V4.75Z"
        fill="#212121"
        fillOpacity=".3"
        stroke="none"
      />
      <path
        d="M5.75 2.75V0.75"
        fill="none"
        stroke="#212121"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.25 2.75V0.75"
        fill="none"
        stroke="#212121"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M13.75 2.75H4.25C3.14543 2.75 2.25 3.64543 2.25 4.75V13.25C2.25 14.3546 3.14543 15.25 4.25 15.25H13.75C14.8546 15.25 15.75 14.3546 15.75 13.25V4.75C15.75 3.64543 14.8546 2.75 13.75 2.75Z"
        fill="none"
        stroke="#212121"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M2.25 6.25H15.75"
        fill="none"
        stroke="#212121"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

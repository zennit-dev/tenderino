import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const CalendarIcon = ({ ...props }: IconProps) => {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" {...props}>
      <g>
        <path
          d="M1.5 4.75C1.5 3.23128 2.73069 2 4.25 2H13.75C15.2693 2 16.5 3.23128 16.5 4.75V13.25C16.5 14.7687 15.2693 16 13.75 16H4.25C2.73069 16 1.5 14.7687 1.5 13.25V4.75Z"
          fillOpacity=".4"
          fillRule="evenodd"
        />
        <path
          d="M6.5 0.75C6.5 0.335786 6.16421 0 5.75 0C5.33579 0 5 0.335786 5 0.75V2H4.25C2.73079 2 1.5 3.23079 1.5 4.75V6H16.5V4.75C16.5 3.23079 15.2692 2 13.75 2H13V0.75C13 0.335786 12.6642 0 12.25 0C11.8358 0 11.5 0.335786 11.5 0.75V2H6.5V0.75Z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default CalendarIcon;

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const ShopIcon = ({ ...props }: IconProps) => (
  <svg height="18" width="18" viewBox="0 0 18 18" {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
      <g fill="currentColor">
        <path
          d="M13.668 1.75H4.331C3.972 1.75 3.64 1.943 3.462 2.255L1.756 5.25C2.231 6.281 3.266 7 4.476 7C5.384 7 6.188 6.588 6.738 5.951C7.288 6.588 8.092 7 9 7C9.908 7 10.711 6.589 11.261 5.952C11.811 6.589 12.615 7 13.522 7C14.731 7 15.767 6.281 16.242 5.25L14.538 2.255C14.36 1.943 14.027 1.75 13.668 1.75Z"
          fill="currentColor"
          fillOpacity=".3"
          data-stroke="none"
          stroke="none"
        />
        <path
          d="M7.25 16V13C7.25 12.034 8.034 11.25 9 11.25C9.966 11.25 10.75 12.034 10.75 13V16"
          fill="currentColor"
          fillOpacity=".3"
          data-stroke="none"
          stroke="none"
        />
        <path
          d="M3.75 16.25V9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M14.25 9.5V16.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M13.668 1.75H4.331C3.972 1.75 3.64 1.943 3.462 2.255L1.756 5.25C2.231 6.281 3.266 7 4.476 7C5.384 7 6.188 6.588 6.738 5.951C7.288 6.588 8.092 7 9 7C9.908 7 10.711 6.589 11.261 5.952C11.811 6.589 12.615 7 13.522 7C14.731 7 15.767 6.281 16.242 5.25L14.538 2.255C14.36 1.943 14.027 1.75 13.668 1.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M7.25 16V13C7.25 12.034 8.034 11.25 9 11.25C9.966 11.25 10.75 12.034 10.75 13V16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M1.75 16.25H16.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  </svg>
);

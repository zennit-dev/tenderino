import type { IconProps } from "@zenncore/types/components";

export const FilterIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    width={24}
    height={24}
    {...props}

  >
    <g fill="currentColor">
      <path
        d="M10.5 14.75L7.5 16.25V9L2.75 2.75H15.25L10.5 9V14.75Z"
        fill="currentColor"
        fillOpacity=".3"
        data-stroke="none"
        stroke="none"
      />
      <path
        d="M10.5 14.75L7.5 16.25V9L2.75 2.75H15.25L10.5 9V14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

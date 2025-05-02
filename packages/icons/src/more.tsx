import type { IconProps } from "@zenncore/types/components";

export const MoreIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <rect
      x="10.5"
      y="3"
      width="3"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10.5"
      y="10.5"
      width="3"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10.5"
      y="18"
      width="3"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

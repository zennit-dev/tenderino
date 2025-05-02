import type { IconProps } from "@zenncore/types/components";

export const CircleIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <title>Circle Icon</title>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

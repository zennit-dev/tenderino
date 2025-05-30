import type { IconProps } from "@zenncore/types/components";

export const ParkingSignIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <title>Parking Sign</title>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9 13V8.4C9 8.02774 9 7.84162 9.04894 7.69098C9.14786 7.38655 9.38655 7.14786 9.69098 7.04894C9.84162 7 10.0277 7 10.4 7H13C14.6569 7 16 8.34315 16 10C16 11.6569 14.6569 13 13 13H9ZM9 13V18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

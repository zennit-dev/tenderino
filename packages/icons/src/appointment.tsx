import type { IconProps } from "@zenncore/types/components";

export const AppointmentIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <path
      d="M16 2V5M6 2V5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 13V11.5C20 7.72876 20 5.84315 18.8284 4.67157C17.6569 3.5 15.7712 3.5 12 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 19.5C14 19.5 15.3485 20.0067 16 22C16 22 19.1765 17 22 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 8.5H19.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

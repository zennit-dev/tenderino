import type { IconProps } from "@zenncore/types/components";

export const ThemeIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <g fill="currentColor">
      <path
        d="m13.6104,15.0581c-.2383.2808-.5859.4419-.9541.4419h-7.3125c-.3682,0-.7158-.1611-.9541-.4419-.1171-.1384-.2003-.2988-.2483-.4688l.2766,1.0923c.1982.7764.8955,1.3184,1.6963,1.3184h5.7715c.7998,0,1.498-.542,1.6963-1.3198l.2766-1.0908c-.048.1702-.1312.3303-.2482.4688Z"
        fill="currentColor"
        opacity=".4"
        strokeWidth="0"
      />
      <path
        d="m11.75,1h-5.5c-.6904,0-1.25.5596-1.25,1.25v6.75h8V2.25c0-.6904-.5596-1.25-1.25-1.25Z"
        strokeWidth="0"
        fill="currentColor"
      />
      <path
        d="m13,9H5l-.8896,5.0449c-.0596.3633.042.7324.2793,1.0132.2383.2808.5859.4419.9541.4419h7.3125c.3682,0,.7158-.1611.9541-.4419.2373-.2808.3389-.6499.2793-1.0132l-.8896-5.0449Z"
        fill="currentColor"
        opacity=".2"
        strokeWidth="0"
      />
    </g>
  </svg>
);

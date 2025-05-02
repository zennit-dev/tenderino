import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export type Route = {
  path: string;
  label: string;
  Icon: IconProp;
  description?: string;
  routes?: Route[];
};

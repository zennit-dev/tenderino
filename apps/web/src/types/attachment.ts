import type { Metadata } from "./metadata";

export type Attachment = Metadata & {
  name: string;
  url: string;
};

import type { Metadata } from "./metadata";

export type Attachment = Metadata & {
  name: string;
  document_url: string;
  uploaded_at: string;
};

import type { Attachment } from "./attachment";
import type { Metadata } from "./metadata";

export type CompletedCriteria = Metadata &
  (
    | {
        content: string;
      }
    | {
        document: Attachment;
      }
  );

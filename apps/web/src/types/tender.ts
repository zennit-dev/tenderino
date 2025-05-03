import type { Attachment } from "./attachment";
import type { Criteria } from "./criteria";
import type { Metadata } from "./metadata";

export type Tender = Metadata & {
  title: string;
  description: string;
  criteria: Criteria[];
  attachments: Attachment[];
  open_date: string;
  expire_date: string;
  max_amount: number;
  status: TenderStatus;
};

export const TenderStatus = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  AWARDED: "Awarded",
  PUBLISHED: "Published",
  UNDER_EVALUATION: "Under Evaluation",
} as const;

export type TenderStatus = (typeof TenderStatus)[keyof typeof TenderStatus];
export const TENDER_STATUSES = Object.values(TenderStatus);

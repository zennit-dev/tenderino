import type { CompletedCriteria } from "./completed-criteria";
import type { Metadata } from "./metadata";

export type Application = Metadata & {
  amount: number;
  applicant: number;
  tender: number;
  criteria_completed: CompletedCriteria[];
};

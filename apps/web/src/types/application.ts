import type { CompletedCriteria } from "./completed-criteria";
import type { Evaluation } from "./evaluation";
import type { Metadata } from "./metadata";
import type { User } from "./user";

export type Application = Metadata & {
  amount: number;
  applicant: User;
  tender: number;
  criteria_completed: CompletedCriteria[];
  evaluation: Evaluation | null;
};

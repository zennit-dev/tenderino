import type { Metadata } from "./metadata";

export type Criteria = Metadata & {
  type: CriteriaType;
  category: CriteriaCategory;
  description: string;
  weight: number;
};

export const CriteriaType = {
  DOCUMENT: "document",
  DESCRIPTION: "description",
} as const;

export type CriteriaType = (typeof CriteriaType)[keyof typeof CriteriaType];
export const CRITERIA_TYPES = Object.values(CriteriaType);

export const CriteriaCategory = {
  EVALUATION: "Evaluation",
  APPLICATION: "Application",
  QUALIFICATION: "Qualification",
} as const;

export type CriteriaCategory =
  (typeof CriteriaCategory)[keyof typeof CriteriaCategory];
export const CRITERIA_CATEGORIES = Object.values(CriteriaCategory);

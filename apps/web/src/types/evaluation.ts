export type Evaluation = {
  applicationId: number;
  scores: {
    criteriaId: number;
    score: number;
    feedback?: string;
  }[];
};

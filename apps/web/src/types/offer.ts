export type Offer = {
  id: number;
  name: string;
  logo: string;
  description: string;
  score: number;
  isEvaluated: boolean;
  attachments: {
    id: number;
    name: string;
    url: string;
  }[];
  inquiry: string;
};

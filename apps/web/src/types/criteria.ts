export type Criteria = {
  id: number;
  name: string;
  type: "document" | "description";
  description: string;
  weight: number;
};

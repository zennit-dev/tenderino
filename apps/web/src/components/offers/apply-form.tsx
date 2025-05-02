import { field, InferredForm } from "@zennui/web/form";
import { z } from "zod";

export const ApplyForm = () => {
  const config = Object.fromEntries(
    criteria.map(({ id, name, description, type }) => [
      id,
      field({
        label: name,
        description,
        shape: type === "document" ? "file" : "text",
        constraint:
          type === "document" ? z.array(z.instanceof(File)) : z.string(),
      }),
    ])
  );

  return <InferredForm config={config} />;
};

const criteria = [
  {
    id: 1,
    name: "Criteria 1",
    type: "document",
    description: "Description of the criteria",
    weight: 1,
  },
  {
    id: 2,
    name: "Criteria 2",
    type: "description",
    description: "Description of the criteria",
    weight: 1,
  },
];

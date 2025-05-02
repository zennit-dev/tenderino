"use client";

import { field, InferredForm } from "@zennui/web/form";
import { z } from "zod";

export const EvaluateForm = () => {
  const config = Object.fromEntries(
    criteria.map(({ id, name, description, weight }) => [
      id,
      field({
        label: name,
        description,
        shape: "slider",
        constraint: z.number(),
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 0,
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

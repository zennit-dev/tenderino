"use client";
import { XIcon } from "@zennui/icons";
import { field, InferredForm } from "@zennui/web/form";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  return (
    <main>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Apply for Tender</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">Apply for the tender.</p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <InferredForm config={config} />
    </main>
  );
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

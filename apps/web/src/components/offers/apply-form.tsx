"use client";
import type { Tender } from "@/types/tender";
import { XIcon } from "@zennui/icons";
import { field, InferredForm, type InferredFormFields } from "@zennui/web/form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { analyzeDocument, create } from "@/server/application";
import { toast } from "sonner";
import { resultify } from "@zenncore/utils";

type ApplyFormProps = Tender;

export const ApplyForm = ({ criteria }: ApplyFormProps) => {
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

  const handleSubmit = async (data: InferredFormFields<typeof config>) => {
    const documents = Object.entries(data).filter(
      ([_, value]) =>
        Array.isArray(value) && value.some((v) => v instanceof File)
    );

    const results = await Promise.all(
      documents.map(([id, value]) =>
        resultify(async () => {
          const document = value[0] as File;
          const description = criteria.find(
            (c) => c.id.toString() === id
          )?.description;

          if (!description) return;

          const result = await analyzeDocument(document, description);

          if (!result.matches) {
            toast.error(
              `Please upload the required documents: ${description} does not match the document uploaded, ${result.explanation}`
            );
            throw new Error("Document does not match the required criteria");
          }
        })
      )
    );

    const valid = results.every((r) => r.success);

    if (!valid) return;

    // const offer = await create({
    //   tenderId: tender.id,
    // });
  };

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
      <InferredForm config={config} onSubmit={handleSubmit} />
    </main>
  );
};

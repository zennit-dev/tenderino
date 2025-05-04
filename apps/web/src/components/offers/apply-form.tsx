"use client";
import type { Tender } from "@/types/tender";
import { ContinueIcon, XIcon } from "@zennui/icons";
import {
  field,
  type FormConfig,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/web/form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { analyzeDocument, create } from "@/server/application";
import { toast } from "sonner";
import { resultify } from "@zenncore/utils";
import { useTransition } from "react";

type ApplyFormProps = Tender;

export const ApplyForm = ({ criteria, id }: ApplyFormProps) => {
  const config = Object.fromEntries([
    [
      "amount",
      field({
        label: "Amount",
        shape: "text",
        constraint: z.coerce.number(),
        placeholder: "Enter the amount",
        description: "The amount of money you are applying for",
      }),
    ],
    ...criteria.map(({ id, description, type }) => [
      id.toString(),
      field({
        label: description,
        shape: type === "document" ? "file" : "text",
        accept: type === "document" ? "application/pdf,image/*" : undefined,
        constraint:
          type === "document" ? z.array(z.instanceof(File)) : z.string(),
      }),
    ]),
  ]) satisfies FormConfig;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: InferredFormFields<typeof config>) => {
    const documents = Object.entries(data).filter(
      ([_, value]) =>
        Array.isArray(value) && value.some((v) => v instanceof File)
    );

    const results = await Promise.all(
      documents.map(async ([id, value]) => {
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
        }

        return result.matches;
      })
    );

    console.log(results);
    const valid = results.every((r) => r);

    if (!valid) return;

    const { amount, ...following } = data;

    const content = Object.entries(following).filter(
      ([, item]) => typeof item === "string"
    );

    const request = new FormData();

    request.append(
      "applicationData",
      JSON.stringify({
        tender: id,
        amount,
        criteria: content.map(([, value]) => ({
          content: value,
        })),
      })
    );

    documents.forEach(([, value], index) => {
      request.append(`document_criteria[${index}][document]`, value[0]);
    });

    const application = await create<FormData>(request);

    if (!application.success) {
      toast.error(application.error);
      return;
    }

    toast.success("Application submitted successfully");

    console.log(request);
    router.back();
  };

  return (
    <main>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Apply for Tender</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-foreground-dimmed">Apply for the tender.</p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <InferredForm
        config={config}
        onSubmit={(data) => startTransition(() => handleSubmit(data))}
      >
        <FormSubmitButton disabled={isPending}>
          <ContinueIcon />
          {isPending ? "Applying..." : "Apply"}
        </FormSubmitButton>
      </InferredForm>
    </main>
  );
};

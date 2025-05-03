"use client";

import { CheckIcon, LogInIcon, PlusCircleIcon, XIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import {
  field,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/web/form";
import { Tabs, TabsContent } from "@zennui/web/tabs";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { AIButton } from "../ai-button";
import { create, generateCriteria } from "@/server/tender";
import { Tender } from "@/types/tender";

export const TenderForm = () => {
  const router = useRouter();

  const [active, setActive] = useState("general");
  const [form, setForm] = useState<{
    general: InferredFormFields<typeof general> | null;
    requirments: InferredFormFields<typeof requirment>[];
    documents: InferredFormFields<typeof document> | null;
  }>({
    general: null,
    requirments: [],
    documents: null,
  });
  const [isAIPending, startAITransition] = useTransition();
  const [isSubmissionPending, startSubmissionTransition] = useTransition();

  const handleGeneralSubmit = (data: InferredFormFields<typeof general>) => {
    setActive("documents");
    setForm({
      ...form,
      general: data,
    });
  };

  const handleDocumentSubmit = (data: InferredFormFields<typeof document>) => {
    setActive("requirments");
    setForm({
      ...form,
      documents: data,
    });
  };

  const handleRequirmentSubmit = async () => {
    if (!form.general) return;
    if (!form.documents) return;
    if (!form.requirments) return;

    const request = new FormData();

    request.append(
      "tenderData",
      JSON.stringify({
        title: form.general.title,
        description: form.general.description,
        expire_date:
          form.general.period.end?.toISOString() ?? new Date().toISOString(),
        open_date:
          form.general.period.start?.toISOString() ?? new Date().toISOString(),
        max_amount: form.general.budget,
        criteria: form.requirments,
      })
    );

    form.documents?.document.forEach((document, index) => {
      request.append(`documents[${index}][document]`, document);
    });

    await create<FormData>(request);
  };

  const handleAADFGeneration = async () => {
    if (!form.general) return;
    const criteria = await generateCriteria({
      title: form.general.title,
      description: form.general.description,
    });

    setForm({
      ...form,
      requirments: criteria.map((c) => ({
        ...c,
        type: "description",
        id: uuid(),
      })),
    });
  };

  return (
    <section className="size-full">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">New Tender</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">
          Create a new tender to start a new procurement process.
        </p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <Tabs value={active} onValueChange={setActive}>
        <TabsContent value="general">
          <InferredForm config={general} onSubmit={handleGeneralSubmit}>
            <FormSubmitButton>
              <LogInIcon />
              Continue to Requirments
            </FormSubmitButton>
          </InferredForm>
        </TabsContent>
        <TabsContent value="requirments" className="flex flex-col gap-4 py-4">
          {form.requirments.map((value) => (
            <div key={value.title}>
              <InferredForm config={requirment} defaultValues={value} />
            </div>
          ))}
          <Button
            onClick={() =>
              setForm({
                ...form,
                requirments: [
                  ...form.requirments,
                  {
                    title: "New Requirment",
                    type: "description",
                    description: "New Requirment",
                    weight: 0,
                  },
                ],
              })
            }
            variant={"soft"}
            className="w-full"
          >
            <PlusCircleIcon />
            Add Requirment
          </Button>
          <AIButton
            className="w-full"
            onClick={() => startAITransition(handleAADFGeneration)}
            disabled={isAIPending}
          >
            {isAIPending ? "Generating..." : "Generate with AI"}
          </AIButton>
          <Button
            className="ml-auto"
            onClick={() => startSubmissionTransition(handleRequirmentSubmit)}
          >
            <CheckIcon />
            {isSubmissionPending ? "Submitting..." : "Submit"}
          </Button>
        </TabsContent>
        <TabsContent value="documents">
          <InferredForm config={document} onSubmit={handleDocumentSubmit}>
            <FormSubmitButton>
              Continue to Requirments
              <LogInIcon />
            </FormSubmitButton>
          </InferredForm>
        </TabsContent>
      </Tabs>
    </section>
  );
};

const general = {
  title: field({
    label: "Title",
    placeholder: "Enter a title for the tender",
    constraint: z.string().min(1),
    shape: "text",
  }),
  description: field({
    label: "Description",
    placeholder: "Enter a description for the tender",
    constraint: z.string().min(1),
    shape: "textarea",
  }),
  period: field({
    label: "Period",
    constraint: z.object({
      start: z.date().optional(),
      end: z.date().optional(),
    }),
    shape: "date",
    type: "date-range",
  }),
  budget: field({
    label: "Budget",
    placeholder: "Enter a budget for the tender",
    constraint: z.coerce.number().min(0),
    shape: "text",
    type: "number",
  }),
};
const requirment = {
  title: field({
    label: "Title",
    placeholder: "Enter a title for the requirment",
    constraint: z.string().min(1),
    shape: "text",
  }),
  type: field({
    label: "Type",
    placeholder: "Select a type for the requirment",
    constraint: z.enum(["document", "description", "value"]),
    shape: "select",
  }),
  weight: field({
    label: "Weight",
    placeholder: "Enter a weight for the requirment",
    constraint: z.number().min(0),
    shape: "text",
    type: "number",
  }),
  description: field({
    label: "Description",
    placeholder: "Enter a description for the requirment",
    constraint: z.string().min(1),
    shape: "textarea",
  }),
};
const document = {
  document: field({
    label: "Document",
    constraint: z.array(z.instanceof(File)),
    shape: "file",
  }),
};

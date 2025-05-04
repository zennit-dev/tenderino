"use client";

import {
  AIIcon,
  CheckIcon,
  ContinueIcon,
  PlusCircleIcon,
  StarIcon,
  XIcon,
} from "@zennui/icons";
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
import { AIButton } from "../ai-button";
import {
  create,
  generateAADFCriteria,
  generateTenderCriteria,
} from "@/server/tender";
import { TenderStatus } from "@/types/tender";
import { toast } from "sonner";
import {
  CRITERIA_CATEGORIES,
  CriteriaCategory,
  CriteriaType,
} from "@/types/criteria";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@zennui/web/dropdown-menu";

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
    const tender = {
      title: form.general.title,
      description: form.general.description,
      expire_date:
        form.general.period.end?.toISOString() ?? new Date().toISOString(),
      open_date:
        form.general.period.start?.toISOString() ?? new Date().toISOString(),
      max_amount: form.general.budget,
      criteria: form.requirments,
      status: TenderStatus.DRAFT,
      category: "Construction",
    };

    request.append("tenderData", JSON.stringify(tender));

    form.documents?.document.forEach((document, index) => {
      request.append(`document_criteria[${index}][document]`, document);
    });

    const result = await create<FormData>(request);

    if (!result.success) {
      console.error("Server error:", result.error);
      toast.error(result.error);
      return;
    }

    router.back();
  };

  const handleAADFGeneration = async () => {
    if (!form.general) return;
    const criteria = await generateAADFCriteria({
      title: form.general.title,
      description: form.general.description,
    });

    setForm({
      ...form,
      requirments: criteria.map(({ description, weight }) => ({
        description,
        type: CriteriaType.DOCUMENT,
        weight,
        category: CriteriaCategory.EVALUATION,
      })),
    });
  };

  const handleTenderDataGeneration = async () => {
    if (!form.general) return;
    if (!form.documents) return;

    const content =
      (await form.documents.document[0]?.text()) ?? form.general.description;
    const request =
      content?.length > 10000
        ? `${content.substring(0, 10000)}... (truncated)`
        : content ?? form.general.description;

    const criteria = await generateTenderCriteria({
      title: form.general.title,
      description: request,
    });

    setForm({
      ...form,
      requirments: criteria.map(({ description, weight }) => ({
        description,
        type: CriteriaType.DOCUMENT,
        weight,
        category: CriteriaCategory.EVALUATION,
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
              <ContinueIcon />
              Continue to Requirments
            </FormSubmitButton>
          </InferredForm>
        </TabsContent>
        <TabsContent value="requirments" className="flex flex-col gap-4 py-4">
          {form.requirments.map((value, index) => (
            <div key={value.description}>
              <InferredForm
                config={requirment}
                defaultValues={value}
                onChange={(data) => {
                  setForm({
                    ...form,
                    requirments: form.requirments.map((v, i) =>
                      i === index ? { ...v, ...data } : v
                    ),
                  });
                }}
              />
            </div>
          ))}
          <Button
            onClick={() =>
              setForm({
                ...form,
                requirments: [
                  ...form.requirments,
                  {
                    type: "description",
                    description: "New Requirment",
                    weight: 0,
                    category: CriteriaCategory.APPLICATION,
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

          <DropdownMenu>
            <DropdownMenuTrigger className="bg-gradient-to-r from-[#289BD6] to-[#D82657] p-2 text-white rounded-lg flex items-center gap-2 justify-center">
              {/* <AIButton
                className="w-full"
                onClick={() => startAITransition(handleAADFGeneration)}
                disabled={isAIPending}
              > */}
              <AIIcon />
              {isAIPending ? "Generating..." : "Generate with AI"}
              {/* </AIButton> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => startAITransition(handleAADFGeneration)}
              >
                AADF's Core Principles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => startAITransition(handleTenderDataGeneration)}
              >
                Tender Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <ContinueIcon />
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
  category: field({
    label: "Category",
    placeholder: "Enter a category for the requirment",
    constraint: z.enum(CRITERIA_CATEGORIES as [string, ...string[]]),
    shape: "select",
  }),
};
const document = {
  document: field({
    label: "Document",
    constraint: z.array(z.instanceof(File)),
    shape: "file",
    multiple: true,
    accept: {
      "application/*": [".pdf", ".doc", ".docx"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  }),
};

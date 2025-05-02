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
import { useState } from "react";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const TenderForm = () => {
  const router = useRouter();

  const [active, setActive] = useState("general");

  const handleGeneralSubmit = (data: InferredFormFields<typeof general>) => {
    setActive("requirments");
  };

  const handleRequirmentSubmit = (
    data: InferredFormFields<typeof requirment>
  ) => {
    setActive("documents");
  };

  const handleDocumentSubmit = (data: InferredFormFields<typeof document>) => {
    console.log(data);
  };

  const [requirments, setRequirments] = useState<string[]>([uuid()]);
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
        <TabsContent value="requirments" className="flex flex-col gap-4">
          {requirments.map((id) => (
            <div key={id}>
              <InferredForm
                config={requirment}
                onSubmit={handleRequirmentSubmit}
              />
            </div>
          ))}
          <Button
            onClick={() => setRequirments([...requirments, uuid()])}
            variant={"soft"}
            className="w-full"
          >
            <PlusCircleIcon />
            Add Requirment
          </Button>
          <Button className="ml-auto">
            <LogInIcon />
            Continue to Documents
          </Button>
        </TabsContent>
        <TabsContent value="documents">
          <InferredForm config={document} onSubmit={handleDocumentSubmit}>
            <FormSubmitButton>
              <CheckIcon />
              Submit
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

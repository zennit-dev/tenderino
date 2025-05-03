"use client";
import {
  field,
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormSubmitButton,
  InferredForm,
  useInferredForm,
  InferredFormField,
  FormDescription,
  FormMessage,
} from "@zennui/web/form";
import { z } from "zod";
import { AIButton } from "../ai-button";
import { cn } from "@zenncore/utils";
import type { Criteria } from "@/types/criteria";
import { generateEvaluation } from "@/server/offer";
import { useTransition } from "react";
import { CheckIcon, StarIcon } from "@zennui/icons";
import { Offer } from "@/types/offer";

export const OfferForm = () => {
  const config = Object.fromEntries(
    criteria.map(({ id, name, description }) => [
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

  const [isPending, startTransition] = useTransition();

  const form = useInferredForm(config);

  const handleAIEvaluation = async () => {
    const evaluation = await generateEvaluation(criteria, offer);
    for (const { id, score } of evaluation) {
      form.setValue(id, score);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form className={cn("flex flex-col gap-2.5")}>
          {Object.entries(config).map(([key, props]) => (
            <FormField
              name={key}
              key={key}
              shouldUnregister
              render={({ field }) => (
                <FormItem className={props.classList?.root}>
                  <div className={cn("flex flex-col gap-1")}>
                    <FormLabel className="capitalize text-primary-dimmed text-lg flex items-center gap-2">
                      <StarIcon className="size-5 text-yellow-500" />
                      {props.label}
                    </FormLabel>
                    <FormDescription>{props.description}</FormDescription>
                    <FormControl>
                      <InferredFormField
                        {...field}
                        {...props}
                        className={props.className}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          ))}
          <div className={"flex w-full justify-end flex items-center gap-2"}>
            <AIButton
              onClick={() => startTransition(handleAIEvaluation)}
              disabled={isPending}
            >
              {isPending ? "Evaluating..." : "Evaluate with AI"}
            </AIButton>
            <FormSubmitButton>
              <CheckIcon />
              Submit
            </FormSubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

const criteria: Criteria[] = [
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

const offer: Offer = {
  id: 1,
  name: "Offer 1",
  description: "Description of the offer",
  score: 0,
  isEvaluated: false,
  attachments: [],
  inquiry: "Inquiry 1",
};

"use client";
import {
  field,
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormSubmitButton,
  useInferredForm,
  InferredFormField,
  FormDescription,
  type InferredFormFields,
  type FormConfig,
} from "@zennui/web/form";
import { z } from "zod";
import { AIButton } from "../ai-button";
import { cn } from "@zenncore/utils";
import { generateEvaluation } from "@/server/application";
import { type ReactNode, useTransition } from "react";
import { CheckIcon, StarIcon, XIcon } from "@zennui/icons";
import type { Application } from "@/types/application";
import { useRouter } from "next/navigation";
import type { Tender } from "@/types/tender";
import { create } from "@/server/evaluation";
import { toast } from "sonner";

export type EvaluationFormProps = {
  tender: Tender;
  application: Application;
};

export const EvaluationForm = ({
  tender,
  application,
}: EvaluationFormProps) => {
  const config = Object.fromEntries(
    tender.criteria.map(({ id, description }) => [
      id,
      field({
        label: description,
        shape: "slider",
        constraint: z.number(),
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 0,
      }),
    ])
  ) satisfies FormConfig;

  const [isPending, startTransition] = useTransition();

  const form = useInferredForm(config);

  const handleAIEvaluation = async () => {
    const evaluation = await generateEvaluation(tender.criteria, application);
    for (const { id, score } of evaluation) {
      form.setValue(id, score);
    }
  };

  const handleSubmit = async (data: InferredFormFields<typeof config>) => {
    const result = await create({
      application_id: application.id,
      application: application.id,
      scores: Object.entries(data).map(([id, value], index) => ({
        criteria_id: application.criteria_completed[index]?.id ?? id,
        score: value * 10,
        feedback: "No comment",
        is_document: false,
      })),
      notes: "No comment",
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    router.push(`/evaluation/tenders/${tender.id}/offers/${application.id}`);
  };
  const router = useRouter();

  return (
    <main>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Evaluate Tender Offers</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">
          Evaluate the offers for the tender.
        </p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            className={cn("flex flex-col gap-2.5")}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/** @ts-ignore */}
            {Object.entries(config).map(
              ([key, props]): ReactNode => (
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
                          <span className="text-muted-foreground text-sm ml-auto">
                            Weight{" "}
                            {tender.criteria.find(
                              (c) => c.id.toString() === key.toString()
                            )?.weight ?? 0}{" "}
                            / 1
                          </span>
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
              )
            )}
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
    </main>
  );
};

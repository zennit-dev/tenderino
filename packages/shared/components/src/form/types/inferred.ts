import type { z } from "zod";
import type { FormConfig } from "./field-config";

export type InferZodSchema<T extends FormConfig> = z.ZodObject<{
  [K in keyof T]: T[K]["constraint"];
}>;

export type InferFormReturn<T extends FormConfig> = z.infer<InferZodSchema<T>>;

export type OutputFormFields<T extends FormConfig> = z.output<
  InferZodSchema<T>
>;

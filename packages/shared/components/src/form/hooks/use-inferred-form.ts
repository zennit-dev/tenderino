"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DefaultValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import type { z } from "zod";
import type { FormConfig, InferFormReturn } from "../types";
import {
  generateSchema,
  getConfigDefaultValues,
  getSchemaDefaultValues,
} from "../utils"; // type InferExtendReturnType<T extends FormConfig> = T extends {

// type InferExtendReturnType<T extends FormConfig> = T extends {
//   extend: (schema: z.ZodSchema<InferredFormFields<T>>) => infer U;
// }
//   ? U extends CoreType<z.ZodSchema<InferredFormFields<T>>>
//     ? U
//     : never
//   : never;

// todo: make the return schema here be wrapped with ZodEffects, Pipes and what not
export type UseInferredFormAdditionalParams<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
> = {
  defaultValues?: Partial<InferFormReturn<T>>;
  extend?: (schema: z.ZodSchema<InferFormReturn<T>>) => S;
  hideFormFields?: (
    data: z.infer<S>,
  ) => Partial<Record<keyof z.infer<S>, boolean>>;
  props?: Partial<Omit<UseFormProps<z.infer<S>>, "resolver" | "defaultValues">>;
};

export type UseInferredFormWithHideField<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
> = UseFormReturn<z.infer<S>> & {
  getIsFormFieldHidden: (fieldName: keyof T, data: z.infer<S>) => boolean;
};

export function useInferredForm<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
>(
  config: T,
  params: UseInferredFormAdditionalParams<T, S> & {
    hideFormFields: (
      data: z.infer<S>,
    ) => Partial<Record<keyof z.infer<S>, boolean>>;
  },
): UseInferredFormWithHideField<T, S>;

export function useInferredForm<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
>(
  config: T,
  params?: UseInferredFormAdditionalParams<T, S>,
): UseFormReturn<z.infer<S>>;

export function useInferredForm<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
>(
  config: T,
  {
    defaultValues,
    extend = (schema) => schema as S,
    hideFormFields,
    props = {},
  }: UseInferredFormAdditionalParams<T, S> = {},
) {
  const schema = generateSchema(config);
  const extendedSchema = extend(schema);

  const form = useForm<z.infer<S>>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      ...getSchemaDefaultValues(schema),
      ...getConfigDefaultValues(config),
      ...defaultValues,
    } as DefaultValues<z.infer<S>>,
    shouldUnregister: true,
    ...props,
  });

  if (hideFormFields) {
    const getIsFormFieldHidden = (
      fieldName: keyof T,
      data: InferFormReturn<T>,
    ): boolean => {
      const isHiddenField = hideFormFields(data)?.[fieldName] ?? false;

      return isHiddenField;
    };

    return {
      ...form,
      getIsFormFieldHidden,
    };
  }

  return form;
}

export type UseInferredFormParams<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferFormReturn<T>>,
> = Parameters<typeof useInferredForm<T, S>>;

export type ResultFormFields<T> = T extends UseFormReturn<infer U> ? U : never;

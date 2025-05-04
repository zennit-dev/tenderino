import type { UseInferredFormWithHideField } from "@zenncore/components/form";
import { cn } from "@zenncore/utils";
import { useEffect, type ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  type FormConfig,
  InferredFormControl,
  type InferredFormControlProps,
  type InferredFormFields,
  type UseInferredFormParams,
  useInferredForm,
} from ".";
import { Button, type ButtonProps } from "../button";
import type * as z from "zod";

export type InferredFormProps<
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferredFormFields<T>>
> = {
  onSubmit?: (
    data: InferredFormFields<T>,
    form: UseFormReturn<InferredFormFields<T>>
  ) => void | Promise<void>;
  onChange?: (
    data: InferredFormFields<T>,
    form: UseFormReturn<InferredFormFields<T>>
  ) => void | Promise<void>;
  config: UseInferredFormParams<T>[0];
  defaultValues?: NonNullable<UseInferredFormParams<T>[1]>["defaultValues"];
  hideFormFields?: NonNullable<UseInferredFormParams<T>[1]>["hideFormFields"];
  props?: NonNullable<UseInferredFormParams<T>[1]>["props"];
  children?: ReactNode;
  className?: string;
  shouldHideFormField?: (
    fieldName: keyof T,
    data: InferredFormFields<T>
  ) => boolean;
  extend?: (schema: z.ZodSchema<InferredFormFields<T>>) => S;
};

export const InferredForm = <
  T extends FormConfig,
  S extends z.ZodSchema = z.ZodSchema<InferredFormFields<T>>
>({
  config,
  onSubmit,
  props,
  defaultValues,
  hideFormFields,
  children,
  className,
  onChange,
  extend,
}: InferredFormProps<T, S>) => {
  const form = useInferredForm<T, S>(config, {
    defaultValues,
    hideFormFields,
    extend,
    ...props,
  });

  console.log(form.formState.errors);

  const handleFormSubmit = form.handleSubmit((data) => onSubmit?.(data, form));

  useEffect(() => {
    const { unsubscribe } = form.watch((data) => onChange?.(data, form));
    return unsubscribe;
  }, []);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-2.5", className)}
        onSubmit={handleFormSubmit}
        // onChange={handleFormChange}
      >
        {Object.entries(config).map(([key, field]) => {
          type InferredFieldProps = InferredFormControlProps<
            typeof field.shape,
            typeof field.constraint
          >;

          return (
            <InferredFormControl
              {...(field as InferredFieldProps)}
              // @ts-expect-error - we need to fix the typings for this
              hideFormField={
                (form as UseInferredFormWithHideField<T>).getIsFormFieldHidden
              }
              key={key}
              name={key}
            />
          );
        })}
        <div className={"flex w-full justify-end"}>{children}</div>
      </form>
    </Form>
  );
};

export const FormSubmitButton = ({
  variant = "default",
  color = "primary",
  children,
  ...props
}: ButtonProps) => {
  return (
    <Button {...props} variant={variant} color={color} type={"submit"}>
      {children}
    </Button>
  );
};
import type { FormConfig, InferZodSchema } from "../types";

export const mergeSchemaWithConfig = <T extends FormConfig>(
  schema: InferZodSchema<T>,
  config: T,
) => {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([name, constrain]) => {
      const field = config[name];
      if (!field) throw new Error(`No config found for field ${name}`);

      return [
        name,
        {
          ...field,
          constrain,
        },
      ];
    }),
  ) as FormConfig;
};

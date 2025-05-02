import type { FormConfig, InferFormReturn } from "../types";

export const getConfigDefaultValues = <T extends FormConfig>(
  config: T,
): Partial<InferFormReturn<T>> => {
  const configDefaultValuesArray = Object.entries(config)
    .filter(([, { defaultValue }]) => defaultValue !== undefined)
    .map(([key, { defaultValue }]) => [key, defaultValue]);

  return Object.fromEntries(configDefaultValuesArray);
};

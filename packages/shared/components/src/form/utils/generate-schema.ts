import type { FormConfig, InferZodSchema } from "../types";

import { z } from "zod";

export const generateSchema = <T extends FormConfig>(config: T) => {
  const schema = Object.fromEntries(
    Object.entries(config).map(([name, { constraint }]) => [name, constraint]),
  );
  return z.object(schema) as InferZodSchema<T>;
};

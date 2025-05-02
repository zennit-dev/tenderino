import type {
  FieldShape,
  FieldShapePropsMap,
  InferredFieldConfig,
} from "../types";

import type { z } from "zod";

export const field = <
  M extends FieldShapePropsMap,
  S extends FieldShape,
  T extends z.ZodType,
>(
  config: InferredFieldConfig<M, S, T>,
) => config;

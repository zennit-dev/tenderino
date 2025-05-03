"use server";

import { resource } from "@/utils/resource";
import type { Evaluation } from "@/types/evaluation";

export const { create } = resource<Evaluation>("/evaluations");

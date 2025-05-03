"use server";

import { resource } from "@/utils/resource";
import type { User } from "@/types/user";

export const { getById, create } = resource<User>("/users");

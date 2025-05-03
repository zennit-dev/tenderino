import type { Metadata } from "./metadata";

export type User = Metadata & {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  role: UserRole;
};

export const UserRole = {
  VENDOR: "user",
  PROCURMENT: "admin",
  EVALUTATION: "staff",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const USER_ROLES = Object.values(UserRole);

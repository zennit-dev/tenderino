export const Role = {
  USER: "user",
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export const ROLES = Object.values(Role);
export type Role = (typeof Role)[keyof typeof Role];

export const ROLE_COOKIE_NAME = "role";

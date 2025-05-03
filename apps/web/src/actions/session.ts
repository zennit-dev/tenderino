"use server";
import { ROLE_COOKIE_NAME, type Role } from "@/constants";
import { cookies, headers } from "next/headers";

const AUTHENTICATION_COOKIE_NAME = "token";

export const getAuthenticationToken = async () => {
  const cookieJar = await cookies();
  const token = cookieJar.get(AUTHENTICATION_COOKIE_NAME);

  if (!token) throw new Error("No authentication token found");
  return token.value;
};

export const setAuthenticationToken = async (token: string) => {
  const cookieJar = await cookies();
  cookieJar.set(AUTHENTICATION_COOKIE_NAME, token);
};

export const setRoleCookie = async (role: Role) => {
  const cookieJar = await cookies();
  cookieJar.set(ROLE_COOKIE_NAME, role);
};

export const getRoleCookie = async () => {
  const cookieJar = await cookies();
  const role = cookieJar.get(ROLE_COOKIE_NAME);

  if (!role) throw new Error("No role cookie found");
  return role;
};

export const getRequestReferer = async () => {
  const headerList = await headers();
  return headerList.get("Referer");
};

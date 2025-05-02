"use server";

import type { Result } from "@zenncore/types/utilities";
import { cookies } from "next/headers";

export const retrieveAuthToken = async (): Promise<Result<string>> => {
  const cookieJar = await cookies();
  const token = cookieJar.get("token");
  if (!token) {
    return {
      success: false,
      error: "No token found",
    };
  }

  return {
    success: true,
    data: token.value,
  };
};

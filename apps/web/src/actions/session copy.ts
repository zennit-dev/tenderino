"use server";
import type { User } from "@/types/user";
import type { Result } from "@zenncore/types/utilities";
import { cookies, headers } from "next/headers";

export const getCurrentUser = withAuthorization(
  async (init): Promise<Result<User>> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROVIDER}/current-user`,
        init,
      );
      const data: User = await response.json();
      if (!response.ok)
        throw new Error(`Failed to get current user: ${JSON.stringify(data)}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error?.toString() ?? "Unknown error" };
    }
  },
);

export const getCurrentProfile = withAuthorization(
  async (init): Promise<Result<Profile>> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROVIDER}/current-profile`,
        init,
      );
      const data: Profile = await response.json();
      console.log(data);
      if (!response.ok)
        throw new Error(
          `Failed to get current profile: ${JSON.stringify(data)}`,
        );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error?.toString() ?? "Unknown error" };
    }
  },
);

import type { Result } from "@zenncore/types/utilities";
import {
  getRequestReferer,
  setAuthenticationToken,
  setRoleCookie,
} from "./session";

type AuthenticateFields = {
  email: string;
  password: string;
};

export const signIn = async (
  request: AuthenticateFields,
): Promise<Result<{ redirect: string }>> => {
  try {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/accounts/sign-in/`);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/sign-in/`,
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log(data);

    if (!response.ok)
      throw new Error(
        `Sign in failed with status code: ${response.status} and message: ${JSON.stringify(data)}`,
      );

    await setRoleCookie(data.access);
    await setAuthenticationToken(data.token);
    const redirect = (await getRequestReferer()) ?? "/";
    console.log(redirect);

    return {
      success: true,
      data: {
        redirect: "/",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error?.toString() ?? "An unknown error occurred",
    };
  }
};

export const signUp = async (
  request: AuthenticateFields,
): Promise<Result<{ redirect: string }>> => {
  try {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/accounts/sign-up/`);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/sign-in/`,
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log(data);

    if (!response.ok)
      throw new Error(
        `Sign in failed with status code: ${response.status} and message: ${JSON.stringify(data)}`,
      );

    await setRoleCookie(data.access);
    await setAuthenticationToken(data.token);
    const redirect = (await getRequestReferer()) ?? "/";
    console.log(redirect);

    return {
      success: true,
      data: {
        redirect: "/",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error?.toString() ?? "An unknown error occurred",
    };
  }
};

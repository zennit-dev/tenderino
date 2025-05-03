"use server";

import type { Result } from "@zenncore/types/utilities";
import { AccessToken } from "livekit-server-sdk";

export const getRoomParams = async (room: string): Promise<Result<string>> => {
  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: "xhurixhuri@gmail.com",
      },
    );
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return {
      success: true,
      data: await at.toJwt(),
    };
  } catch (error) {
    return {
      success: false,
      error: error?.toString() ?? "Unknown error",
    };
  }
};

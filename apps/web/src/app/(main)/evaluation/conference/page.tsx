import { getRoomParams } from "@/actions/conference";
import { Room } from "@/components/room";
import { connection } from "next/server";

export type DynamicRouteProps<T extends string = "id"> = {
  params: Promise<Record<T, string>>;
};

export default async ({ params }: DynamicRouteProps<"room">) => {
  await connection();
  const { room } = await params;
  const token = await getRoomParams(room);

  if (!token.success) return token.error;

  return <Room token={token.data} serverUrl={process.env.LIVEKIT_URL} />;
};

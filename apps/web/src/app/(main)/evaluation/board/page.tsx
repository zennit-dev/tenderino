"use client";
import { useSyncDemo } from "@tldraw/sync";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useParams } from "next/navigation";

export default () => {
  const { id } = useParams<{ id: string }>();
  // const store = useSyncDemo({ roomId: `project.${id}.board` });
  const store = useSyncDemo({ roomId: "project.zennstream.board" });
  return (
    <section className={"absolute inset-0"}>
      <Tldraw store={store} />
    </section>
  );
};

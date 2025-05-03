import { ApplyForm } from "@/components/offers/apply-form";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
import { getById } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";

export default async ({ params }: DynamicSegmentProps) => {
  const { id } = await params;
  const tender = unwrapResult(await getById(id));

  return <ApplyForm {...tender} />;
};

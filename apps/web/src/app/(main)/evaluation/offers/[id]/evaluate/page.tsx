import { EvaluationForm } from "@/components/offers/evaluation-form";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
import { getById as getOfferById } from "@/server/application";
import { getById as getTenderById } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";

export default async ({ params }: DynamicSegmentProps) => {
  const { id } = await params;

  const offer = unwrapResult(await getOfferById(id));
  const tender = unwrapResult(await getTenderById(offer.tenderId));

  return <EvaluationForm tender={tender} offer={offer} />;
};

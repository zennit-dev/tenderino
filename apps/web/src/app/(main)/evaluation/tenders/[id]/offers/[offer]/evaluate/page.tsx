import { EvaluationForm } from "@/components/offers/evaluation-form";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
import { getById as getOfferById } from "@/server/application";
import { getById as getTenderById } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";

export default async ({ params }: DynamicSegmentProps<"offer">) => {
  const { offer: id } = await params;

  const application = unwrapResult(await getOfferById(id));
  const tender = unwrapResult(await getTenderById(application.tender));

  return <EvaluationForm tender={tender} application={application} />;
};

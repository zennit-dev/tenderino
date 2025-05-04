import { ApplicationsTable } from "@/components/offers/applications-table";
import { getByTender } from "@/server/application";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
import { unwrapResult } from "@zenncore/utils";
export default async ({ params }: DynamicSegmentProps<"id">) => {
  const { id } = await params;
  const applications = unwrapResult(await getByTender(id));

  return <ApplicationsTable applications={applications} />;
};

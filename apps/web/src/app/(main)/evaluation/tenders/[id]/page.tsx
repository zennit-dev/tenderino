import { AIButton } from "@/components/ai-button";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
import {
  CalendarIcon,
  CircleCheckIcon,
  DownloadIcon,
  FileContentIcon,
  InfoIcon,
  LaptopChart,
  UsersIcon,
} from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { getById } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";
import { CriteriaCategory } from "@/types/criteria";
import { format } from "date-fns";

export default async ({ params }: DynamicSegmentProps) => {
  const { id } = await params;
  const tender = unwrapResult(await getById(id));

  const application = tender.criteria.filter(
    ({ category }) => category === CriteriaCategory.APPLICATION
  );

  const eligibility = tender.criteria.filter(
    ({ category }) => category === CriteriaCategory.ELIGIBILITY
  );

  return (
    <div className="flex flex-col h-full overflow-x-hidden overflow-y-auto">
      <div className="flex px-4 flex-col gap-4 border-b border-border">
        <div className="flex gap-4 items-center pb-4">
          <div>
            <h1 className="font-bold text-4xl">{tender.title}</h1>
            <h3 className="text-foreground-dimmed">
              Reference Number: {tender.id}
            </h3>
          </div>
          <Button color="primary" className="ml-auto">
            Evaluate Offers
          </Button>
          <AIButton>AI Evaluation</AIButton>
        </div>
      </div>
      <div className="flex gap-4 px-4 h-full">
        <div className="border-r border-r-border flex-1 pt-8 gap-8 flex flex-col pr-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl">Description</h3>
            <p className="text-foreground-dimmed">{tender.description}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl">Requirements & Eligibility</h3>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">Submission Requirements</h3>
              {application.length > 0 &&
                application.map(({ id, name, description }) => (
                  <div key={id}>
                    <h2 className="flex gap-2 items-center text-foreground-dimmed">
                      <CircleCheckIcon className="fill-green-400" />
                      {name}
                    </h2>
                    <p className="text-foreground-dimmed">{description}</p>
                  </div>
                ))}
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="font-medium text-lg">Eligibility Criteria</h3>
              {eligibility.length > 0 &&
                eligibility.map(({ id, name, description }) => (
                  <div key={id}>
                    <h2 className="flex gap-2 items-center text-foreground-dimmed">
                      <InfoIcon className="fill-red-400" />
                      {name}
                    </h2>
                    <p className="text-foreground-dimmed">{description}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Tender Documents</h3>
            <div className="flex flex-col gap-2 divide-y divide-border">
              {tender.attachments.map(({ id, name, url }) => (
                <div
                  key={id}
                  className="flex gap-2 items-center pb-2 text-foreground-dimmed"
                >
                  <FileContentIcon className="size-7 fill-blue-400" />
                  <div>
                    <p>{name}</p>
                    <p className="text-foreground-dimmed text-sm">{url}</p>
                  </div>
                  <Button color="accent" className="ml-auto">
                    <DownloadIcon className="fill-foreground-dimmed" />
                    <p className="text-foreground-dimmed">Download</p>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" mt-8 h-fit pl-4 py-2 space-y-2">
          <h2 className="font-bold text-xl">Tender Details</h2>
          <div className="divide-y divide-border gap-2 flex flex-col">
            <div className="flex gap-3 items-center pb-2 pr-10">
              <CalendarIcon className="w-7 h-7 fill-red-500" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">
                  Submission Deadline
                </p>
                <p className="font-medium">
                  {format(tender.expire_date, "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center pb-2">
              <LaptopChart className="w-7 h-7" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">Category</p>
                <p className="font-medium">Infrastructure</p>
              </div>
            </div>
            <div className="flex gap-3 items-center pb-2">
              <UsersIcon className="w-7 h-7 fill-blue-500" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">Submissions</p>
                <p className="font-medium">3 Vendors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

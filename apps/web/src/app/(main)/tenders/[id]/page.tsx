import {
  CalendarIcon,
  FileContentIcon,
  LaptopChart,
  UsersIcon,
} from "@zennui/icons";
import { Button } from "@zennui/web/button";
import type { DynamicSegmentProps } from "@zenncore/types/navigation";
const submissionRequirements = [
  "Technical Specification",
  "Price Quote",
  "Delivery Timeline",
];

const eligibilityCriterias = [
  "Registered business",
  "Minimum 3 years experience",
  "Authorized reseller status",
];

const tenderDocuments = [
  {
    name: "Technical Requirements",
    size: "512KB",
  },
  {
    name: "Terms and Conditions",
    size: "154KB",
  },
];

export default async ({ params }: DynamicSegmentProps) => {
  const { id } = await params;

  return (
    <div className="flex flex-col h-full overflow-x-hidden overflow-y-auto">
      <div className="flex px-4 flex-col gap-4 border-b border-border">
        <div className="flex gap-4 items-center pb-4">
          <div>
            <h1 className="font-bold text-4xl">
              Interior Infrastructure Upgrade
            </h1>
            <h3 className="text-foreground-dimmed">
              Reference Number: TQR-001-007
            </h3>
          </div>
          <Button className="ml-auto">Evaluate Offers</Button>
          <Button>AI Evaluation</Button>
        </div>
      </div>
      <div className="flex gap-4 px-4 h-full">
        <div className="border-r border-r-border flex-1 pt-8 gap-8 flex flex-col pr-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl">Description</h3>
            <p className="text-foreground-dimmed">
              We are seeking proposals for the supply of interior design
              furniture and fixtures, including 20 ergonomic office desks, 25
              designer chairs, and associated workspace accessories. The items
              will be used to furnish our new office space and support staff
              comfort, functionality, and aesthetic standards for day-to-day
              operations. Vendors must provide detailed product specifications
              (including materials, dimensions, and finishes), competitive
              pricing, and a clear delivery and installation timeline.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl">Requirements & Eligibility</h3>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">Submission Requirements</h3>
              {submissionRequirements.map((submissionRequirement) => (
                <p
                  key={submissionRequirement}
                  className="flex gap-2 items-center text-foreground-dimmed"
                >
                  <LaptopChart className="fill-green-400" />
                  {submissionRequirement}
                </p>
              ))}
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="font-medium text-lg">Eligibility Criteria</h3>
              {eligibilityCriterias.map((eligibilityCriteria) => (
                <p
                  key={eligibilityCriteria}
                  className="flex gap-2 items-center text-foreground-dimmed"
                >
                  <LaptopChart className="fill-red-400" />
                  {eligibilityCriteria}
                </p>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Tender Documents</h3>
            <div className="flex flex-col gap-2 divide-y divide-y-border">
              {tenderDocuments.map((tenderDocument) => (
                <div
                  key={tenderDocument.name}
                  className="flex gap-2 items-center pb-2 text-foreground-dimmed"
                >
                  <FileContentIcon className="size-7 fill-blue-400" />
                  <div>
                    <p>{tenderDocument.name}</p>
                    <p className="text-foreground-dimmed text-sm">
                      {tenderDocument.size}
                    </p>
                  </div>
                  <Button color="accent" className="ml-auto">
                    <FileContentIcon />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border border-border mt-8 h-fit pl-2 py-2 space-y-2 rounded-xl">
          <h2>Tender Details</h2>
          <div className="divide-y divide-y-border gap-2 flex flex-col">
            <div className="flex gap-3 items-center pb-2 pr-10">
              <CalendarIcon className="w-7 h-7 fill-red-500" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">
                  Submission Deadline
                </p>
                <p className="font-bold">{new Date().toISOString()}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center pb-2">
              <LaptopChart className="w-7 h-7" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">Category</p>
                <p className="font-bold">Infrastructure</p>
              </div>
            </div>
            <div className="flex gap-3 items-center pb-2">
              <UsersIcon className="w-7 h-7 fill-blue-500" />
              <div className="flex flex-col gap-px">
                <p className="text-foreground-dimmed text-sm">Submissions</p>
                <p className="font-bold">3 Vendors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

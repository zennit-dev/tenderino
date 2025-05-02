import {
  FilterIcon,
  InfoIcon,
  LaptopChart,
  MoreIcon,
  PlusCircleIcon,
  UsersIcon,
} from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";
import Link from "next/link";

const TENDERS = [
  {
    id: "fijweifwejfopwejio",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
  {
    id: "cuevieruviwjviw9u",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
  {
    id: "fweifjewifejw1",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
];

export default () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">All Tenders</h1>
      <p>Browse and apply for available procurement opportunities</p>
      <div className="flex gap-2">
        <Input placeholder="SearchTender" />
        <Button className="px-4" color="accent">
          <FilterIcon />
          Filter
        </Button>
        <Link href="/tenders/new">
          <Button color="primary">
            <PlusCircleIcon />
            Create New Tender
          </Button>
        </Link>
      </div>
      <div className="flex-row flex gap-4 flex-wrap">
        {TENDERS.map((tender) => (
          <div
            key={tender.title}
            className="flex w-[calc(33%-theme(spacing.4))] flex-col gap-2 border border-border py-4 rounded-lg"
          >
            <div className="px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 p-2 rounded-full w-fit">
                  <tender.Icon className="h-5 w-5 shrink-0 " />
                </div>
                <button
                  type="button"
                  className="bg-gray-300 text-foreground-dimmed rounded-full px-3 ml-auto"
                >
                  Draft
                </button>
                <button type="button">
                  <MoreIcon />
                </button>
              </div>
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-foreground-dimmed">{tender.description}</p>
              <p className="flex items-center gap-2 text-foreground-dimmed">
                <UsersIcon /> Deadline: {tender.deadline}
              </p>
              <p className="flex items-center gap-2 text-foreground-dimmed">
                <UsersIcon /> {tender.vendorCount} Vendors Applied
              </p>
            </div>
            <div className="border-t flex justify-between items-center border-border pt-4 px-4">
              <Link href={`/tenders/${tender.id}`}>
                <Button>
                  <InfoIcon className="size-5" /> View Details
                </Button>
              </Link>
              <Button color="primary">
                <InfoIcon className="size-5" />
                Publish
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

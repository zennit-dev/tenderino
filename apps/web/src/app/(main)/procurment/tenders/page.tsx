import { TenderCard } from "@/components/tender-card";
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
        <Link href="/procurment/tenders/new">
          <Button color="primary">
            <PlusCircleIcon />
            Create New Tender
          </Button>
        </Link>
      </div>
      <div className="flex-row flex gap-4 flex-wrap">
        {TENDERS.map((tender) => (
          <TenderCard
            key={tender.id}
            {...tender}
            className="w-[calc(33%-theme(spacing.2))]"
          />
        ))}
      </div>
    </div>
  );
};

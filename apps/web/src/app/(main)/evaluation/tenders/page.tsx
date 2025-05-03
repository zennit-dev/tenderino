import { TenderCard } from "@/components/tender-card";
import { FilterIcon, LaptopChart } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";

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
        <Input placeholder="Search for tender" />
        <Button color="accent">
          <FilterIcon />
          Filter
        </Button>
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

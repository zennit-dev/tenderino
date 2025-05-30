import { TenderCard } from "@/components/tender-card";
import { matchTenders, paginate } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";
import { FilterIcon, PlusCircleIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";

export default async () => {
  const tenders = unwrapResult(await matchTenders());
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">All Tenders</h1>
      <p>Browse and apply for available procurement opportunities</p>
      <div className="flex gap-2">
        <Input placeholder="Search Tender" />
        <Button className="px-4" color="accent">
          <FilterIcon />
          Filter
        </Button>
      </div>
      <div className="flex-row flex gap-4 flex-wrap">
        {tenders.map((tender) => (
          <TenderCard
            key={tender.id}
            href={`/vendor/tenders/${tender.id}`}
            {...tender}
            className="w-[calc(33%-theme(spacing.2))]"
          />
        ))}
      </div>
    </div>
  );
};

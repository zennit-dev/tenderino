import { AIButton } from "@/components/ai-button";
import { TenderCard } from "@/components/tender-card";
import { paginate } from "@/server/tender";
import { unwrapResult } from "@zenncore/utils";
import { FilterIcon, PlusCircleIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";
import Link from "next/link";

export default async () => {
  const tenders = unwrapResult(await paginate(1));
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
        <Link href="/vendor/tenders/match">
          <AIButton>Match Tender</AIButton>
        </Link>
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

import type { Tender } from "@/types/tender";
import { cn } from "@zenncore/utils";
import {
  CircleCheckIcon,
  ClockIcon,
  InfoIcon,
  LaptopChart,
  MoreIcon,
  UsersIcon,
} from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { format } from "date-fns";
import Link from "next/link";

type TenderCardProps = Tender & {
  className?: string;
  href: string;
};

export const TenderCard = ({
  title,
  id,
  description,
  expire_date,
  className,
  href,
}: TenderCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border border-border py-4 rounded-lg",
        className
      )}
    >
      <div className="px-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full w-fit">
            <LaptopChart className="h-5 w-5 shrink-0 " />
          </div>
          <button type="button" className="ml-auto">
            <MoreIcon />
          </button>
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-foreground-dimmed line-clamp-4">{description}</p>
        <p className="flex items-center gap-2 text-foreground-dimmed">
          <ClockIcon /> Deadline:{" "}
          {expire_date ? format(expire_date, "MMM d, yyyy") : "-"}
        </p>
        <p className="flex items-center gap-2 text-foreground-dimmed">
          <UsersIcon /> 3 Vendors Applied
        </p>
      </div>
      <div className="border-t flex justify-between items-center border-border pt-4 px-4 mt-auto">
        <Link href={href}>
          <Button color="accent">
            <InfoIcon className="size-5 text-foreground" /> View Details
          </Button>
        </Link>
        <Button color="primary">
          <CircleCheckIcon className="size-5 fill-white" />
          Publish
        </Button>
      </div>
    </div>
  );
};

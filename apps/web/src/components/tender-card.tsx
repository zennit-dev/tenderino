import { cn } from "@zenncore/utils";
import {
  CircleCheckIcon,
  ClockIcon,
  InfoIcon,
  MoreIcon,
  UsersIcon,
} from "@zennui/icons";
import { Button } from "@zennui/web/button";
import Link from "next/link";
import type { FC, SVGProps } from "react";

type TenderCardProps = {
  id: string;
  title: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  description: string;
  deadline: string;
  vendorCount: number;
  className?: string;
};

export const TenderCard = ({
  title,
  Icon,
  id,
  deadline,
  vendorCount,
  description,
  className = "",
}: TenderCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border border-border py-4 rounded-lg",
        className,
      )}
    >
      <div className="px-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full w-fit">
            <Icon className="h-5 w-5 shrink-0 " />
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
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-foreground-dimmed">{description}</p>
        <p className="flex items-center gap-2 text-foreground-dimmed">
          <ClockIcon /> Deadline: {deadline}
        </p>
        <p className="flex items-center gap-2 text-foreground-dimmed">
          <UsersIcon /> {vendorCount} Vendors Applied
        </p>
      </div>
      <div className="border-t flex justify-between items-center border-border pt-4 px-4">
        <Link href={`/tenders/${id}`}>
          <Button color="accent">
            <InfoIcon className="size-5" /> View Details
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

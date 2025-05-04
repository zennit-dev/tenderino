"use client";
import { FlagIcon, ContinueIcon, XIcon } from "@zennui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@zennui/web/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@zennui/web/progress";
import type { Application } from "@/types/application";

type ApplicationsTableProps = {
  applications: Application[];
};

export const ApplicationsTable = ({ applications }: ApplicationsTableProps) => {
  const router = useRouter();
  const [active, setActive] = useState("offers");

  return (
    <section className="size-full">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Evaluate Tender Offers</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">
          Evaluate the offers for the tender.
        </p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="flex flex-col gap-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center gap-2 rounded-lg bg-accent p-4"
            >
              <div className="aspect-square object-cover size-16 relative overflow-hidden">
                <Image
                  src={"/images/logo.png"}
                  fill
                  className="object-cover"
                  alt="logo"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg">{application.applicant.name}</h2>
              </div>

              {application.evaluation ? (
                <h3 className="flex items-center gap-2 text-success whitespace-nowrap ml-auto">
                  <FlagIcon />
                  <span>
                    {application.evaluation.scores.reduce(
                      (acc, curr) => acc + curr.score,
                      0
                    ) / application.evaluation.scores.length}{" "}
                    / 100
                  </span>
                </h3>
              ) : (
                <Link
                  href={`/evaluation/tenders/${application.tender}/offers/${application.id}/evaluate`}
                  className="ml-auto"
                >
                  <ContinueIcon />
                </Link>
              )}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="rankings" className="flex flex-col gap-4">
          {/* {winner && (
            <div
              key={winner.id}
              className="flex items-center gap-2 rounded-lg bg-accent"
            >
              <Image
                src={winner.logo}
                alt={winner.name}
                width={100}
                height={100}
              />
              <h2>{winner.name}</h2>
            </div> 
          )} */}
          {applications
            .filter((application) => application.evaluation)
            .map((application) => (
              <div className="flex flex-col gap-2" key={application.id}>
                <div className="flex items-center gap-2 px-4">
                  <div className="aspect-square object-cover size-16 relative overflow-hidden">
                    <Image
                      src={"/images/logo.png"}
                      fill
                      className="object-cover"
                      alt="logo"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg">{application.applicant.name}</h2>
                  </div>
                  <div className="ml-auto whitespace-nowrap">
                    {application.evaluation!.scores.reduce(
                      (acc, curr) => acc + curr.score,
                      0
                    ) / application.evaluation!.scores.length}{" "}
                    / 100
                  </div>
                </div>
                <Progress
                  value={
                    application.evaluation!.scores.reduce(
                      (acc, curr) => acc + curr.score,
                      0
                    ) / application.evaluation!.scores.length
                  }
                />
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

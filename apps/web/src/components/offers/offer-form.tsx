"use client";
import { FlagIcon, XIcon } from "@zennui/icons";
import { Tabs, TabsContent } from "@zennui/web/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const OfferForm = () => {
  const router = useRouter();
  const [active, setActive] = useState("general");

  return (
    <section className="size-full">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">New Tender</h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">
          Create a new tender to start a new procurement process.
        </p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <Tabs value={active} onValueChange={setActive}>
        <TabsContent value="general" className="flex flex-col gap-4">
          {offers.map((company) => (
            <div
              key={company.id}
              className="flex items-center gap-2 rounded-lg bg-accent"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={100}
                height={100}
              />
              <h2>{company.name}</h2>
              {company.isEvaluated ? (
                <h3 className="flex items-center gap-2 text-success">
                  <FlagIcon />
                  <span>{company.score} / 100</span>
                </h3>
              ) : (
                <Link href={`/offers/${company.id}/evaluate`}>Evaluate</Link>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

const offers = [
  {
    id: "1",
    name: "Company 1",
    logo: "https://via.placeholder.com/150",
    description: "Company 1 description",
    score: 10,
    isEvaluated: false,
  },
];

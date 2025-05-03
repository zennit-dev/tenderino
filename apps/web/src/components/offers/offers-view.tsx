"use client";
import { FlagIcon, LogInIcon, XIcon } from "@zennui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@zennui/web/tabs";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@zennui/web/progress";
import type { Offer } from "@/types/offer";

export const OffersView = () => {
  const router = useRouter();
  const [active, setActive] = useState("offers");

  const winner = offers.sort((a, b) => b.score - a.score)[0];

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
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex items-center gap-2 rounded-lg bg-accent p-4"
            >
              <div className="aspect-square object-cover size-16 relative overflow-hidden">
                <Image
                  src={offer.logo}
                  alt={offer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg">{offer.name}</h2>
              </div>

              {offer.isEvaluated ? (
                <h3 className="flex items-center gap-2 text-success whitespace-nowrap ml-auto">
                  <FlagIcon />
                  <span>{offer.score} / 100</span>
                </h3>
              ) : (
                <Link href={`/offers/${offer.id}/evaluate`} className="ml-auto">
                  <LogInIcon />
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
          {offers
            .filter((company) => company.isEvaluated)
            .map((offer) => (
              <div className="flex flex-col gap-2" key={offer.id}>
                <div className="flex items-center gap-2 px-4">
                  <div className="aspect-square object-cover size-16 relative overflow-hidden">
                    <Image
                      src={offer.logo}
                      alt={offer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg">{offer.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {offer.description}
                    </p>
                  </div>
                  <div className="ml-auto whitespace-nowrap">
                    {offer.score} / 100
                  </div>
                </div>
                <Progress value={offer.score} key={offer.id} />
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

const offers: Offer[] = [
  {
    id: 1,
    name: "Company 1",
    logo: "/images/logo-full.png",
    description: "We are a company that provides services to the public.",
    score: 10,
    isEvaluated: false,
    attachments: [
      {
        id: 1,
        name: "Attachment 1",
        url: "https://via.placeholder.com/150",
      },
    ],
    inquiry: "Inquiry 1",
  },

  {
    id: 2,
    name: "Company 2",
    logo: "/images/logo-full.png",
    description: "We are a company that provides services to the public.",
    score: 10,
    isEvaluated: true,
    attachments: [
      {
        id: 1,
        name: "Attachment 1",
        url: "https://via.placeholder.com/150",
      },
    ],
    inquiry: "Inquiry 1",
  },
];

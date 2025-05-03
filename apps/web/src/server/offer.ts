"use server";

import type { Criteria } from "@/types/criteria";
import type { Offer } from "@/types/offer";
import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";

const evaluationSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  id: z.string(),
});

const schema = z.object({
  evaluation: z.array(evaluationSchema),
});

export const generateEvaluation = async (
  criteria: Criteria[],
  offer: Offer
) => {
  const client = new OpenAI({
    apiKey:
      "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",
  });

  const response = await client.beta.chat.completions.parse({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "You are a tender evaluation expert. You will be given a list of criteria and an offer. You will need to evaluate the offer based on the criteria and return a list of evaluations.",
      },
      {
        role: "user",
        content: `The criteria are ${JSON.stringify(
          criteria
        )} and the offer is ${JSON.stringify(offer)}`,
      },
    ],
    tools: [zodFunction({ parameters: schema, name: "generateEvaluation" })],
  });

  return (
    response.choices[0]?.message.tool_calls?.[0]?.function
      .parsed_arguments as z.infer<typeof schema>
  )?.evaluation;
};

"use server";

import type { Criteria } from "@/types/criteria";
import type { Application } from "@/types/application";
import { resource } from "@/utils/resource";
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

const documentAnalysisSchema = z.object({
  matches: z.boolean(),
  confidence: z.number(),
  explanation: z.string(),
});

export const generateEvaluation = async (
  criteria: Criteria[],
  offer: Application
) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
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

export const analyzeDocument = async (file: File, description: string) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const content = await file.text();

  const response = await client.beta.chat.completions.parse({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "You are a document analysis expert. You will be given a document's content and a description to match against. You will analyze if the document matches the description and provide your reasoning.",
      },
      {
        role: "user",
        content: `Here is the document content:\n\n${content}\n\nDoes this document match the following description?\n\n${description}`,
      },
    ],
    tools: [
      zodFunction({
        parameters: documentAnalysisSchema,
        name: "analyzeDocument",
      }),
    ],
  });

  return response.choices[0]?.message.tool_calls?.[0]?.function
    .parsed_arguments as z.infer<typeof documentAnalysisSchema>;
};

export const { create, getById } = resource<Application>("/applications");

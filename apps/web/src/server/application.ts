"use server";

import type { Criteria } from "@/types/criteria";
import type { Application } from "@/types/application";
import { resource } from "@/utils/resource";
import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";
import type { Result } from "@zenncore/types/utilities";
import type { UniqueIdentifier } from "@zenncore/types";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CONTENT_LENGTH = 10000; // Characters to keep from the document

export const generateEvaluation = async (
  criteria: Criteria[],
  offer: Application
) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await client.beta.chat.completions.parse({
    model: "gpt-3.5-turbo",
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
  if (file.size > MAX_FILE_SIZE) {
    return {
      matches: false,
      confidence: 0,
      explanation: `File is too large. Maximum size is ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    };
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const content = await file.text();
  // Truncate content if it's too long
  const truncatedContent =
    content.length > MAX_CONTENT_LENGTH
      ? `${content.substring(0, MAX_CONTENT_LENGTH)}... (truncated)`
      : content;

  const response = await client.beta.chat.completions.parse({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a document analysis expert. You will be given a document's content and a description to match against. You will analyze if the document matches the description and provide your reasoning.",
      },
      {
        role: "user",
        content: `Here is the document content:\n\n${truncatedContent}\n\nDoes this document match the following description?\n\n${description}`,
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

export const getByTender = async (
  tender: UniqueIdentifier
): Promise<Result<Application[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/?tender=${tender}`
    );
    if (!response.ok) {
      return {
        success: false,
        error: await response.text(),
      };
    }
    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch applications",
    };
  }
};

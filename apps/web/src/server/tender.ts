"use server";
import type { Tender } from "@/types/tender";
import { withAuthorization } from "@/utils/auth";
import { resource } from "@/utils/resource";
import { OpenAI } from "openai";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";
import type { Result } from "@zenncore/types/utilities";
const criteriaSchema = z.object({
  title: z.string(),
  description: z.string(),
  weight: z.number(),
});

const schema = z.object({
  criteria: z.array(criteriaSchema),
});

export const generateAADFCriteria = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<z.infer<typeof criteriaSchema>[]> => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await client.beta.chat.completions.parse({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate a list of evaluation criteria for tender evaluation. Each criterion should follow this format:\n" +
          "- title: A clear, concise name for the criterion\n" +
          "- description: A specific, measurable requirement or condition\n" +
          "- weight: A number between 1-100 representing the importance of this criterion\n\n" +
          "Examples of good criteria:\n" +
          "1. Local Employment: 20% of the workforce must be from the local community (weight: 20)\n" +
          "2. Sustainability: All materials used must be renewable and environmentally friendly (weight: 25)\n\n" +
          "The criteria should be specific, measurable, achievable, relevant, and time-bound (SMART). " +
          "Focus on aspects like local impact, sustainability, community benefits, and alignment with AADF principles.",
      },
      {
        role: "user",
        content: `The tenders theme is ${title} and the description is ${description}`,
      },
    ],
    tools: [zodFunction({ parameters: schema, name: "generateCriteria" })],
  });

  return (
    response.choices[0]?.message.tool_calls?.[0]?.function
      .parsed_arguments as z.infer<typeof schema>
  )?.criteria;
};

export const generateTenderCriteria = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<z.infer<typeof criteriaSchema>[]> => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await client.beta.chat.completions.parse({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate a list of criteria for a tender. Each criterion should follow this format:\n" +
          "- title: A clear, concise name for the criterion\n" +
          "- description: A specific, measurable requirement or condition\n" +
          "- weight: A number between 1-100 representing the importance of this criterion\n\n" +
          "Examples of good criteria:\n" +
          "1. Number of employees: 20\n" +
          "2. Number of suppliers: 10\n\n",
      },
      {
        role: "user",
        content: `The tenders theme is ${title} and the description is ${description}`,
      },
    ],
    tools: [zodFunction({ parameters: schema, name: "generateCriteria" })],
  });

  return (
    response.choices[0]?.message.tool_calls?.[0]?.function
      .parsed_arguments as z.infer<typeof schema>
  )?.criteria;
};

export const { getById, create, paginate } = resource<Tender>("/tenders");

const tenderSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  criteria: z.array(criteriaSchema),
});

const matchTendersSchema = z.object({
  tenders: z.array(tenderSchema),
});

export const matchTenders = withAuthorization(
  async (authorization): Promise<Result<z.infer<typeof tenderSchema>[]>> => {
    const tenders = await paginate(1);

    if (!tenders.success) {
      return { success: false, error: tenders.error };
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const response = await client.beta.chat.completions.parse({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that matches tenders to the user's profile.",
        },
        {
          role: "user",
          content: `Here are the tenders: ${JSON.stringify(tenders.data)}`,
        },
      ],
      tools: [
        zodFunction({ parameters: matchTendersSchema, name: "matchTenders" }),
      ],
    });

    const data = (
      response.choices[0]?.message.tool_calls?.[0]?.function
        .parsed_arguments as z.infer<typeof matchTendersSchema>
    )?.tenders;

    return { success: true, data };
  }
);

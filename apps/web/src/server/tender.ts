"use server";
import { OpenAI } from "openai";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";

const criteriaSchema = z.object({
  title: z.string(),
  description: z.string(),
  weight: z.number(),
});

const schema = z.object({
  criteria: z.array(criteriaSchema),
});

export const generateCriteria = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<z.infer<typeof criteriaSchema>[]> => {
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

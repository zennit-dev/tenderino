"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@zennui/web/chart/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Monday", data: 186 },
  { month: "Tuesday", data: 305 },
  { month: "Wednesday", data: 237 },
  { month: "Thursday", data: 73 },
  { month: "Friday", data: 209 },
  { month: "Saturday", data: 214 },
  { month: "Sunday", data: 120 },
];

const chartConfig = {
  data: {
    label: "data",
    color: "#672974",
  },
} satisfies ChartConfig;

export const AverageVendorRating = () => {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-full w-full max-h-[500px]"
    >
      <BarChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-data)" stopOpacity={0.8} />
            <stop
              offset="100%"
              stopColor="var(--color-data)"
              stopOpacity={0.4}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value[0]}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />

        <Bar dataKey="data" fill="url(#barGradient)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@zennui/web/chart/chart";
import { Area, AreaChart } from "recharts";

type DashboardLineChartProps = {
  chartConfig: ChartConfig;
  chartData?: any[];
};

export const DashboardLineChart = ({
  chartConfig,
  chartData,
}: DashboardLineChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-20">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
          top: 1,
        }}
      >
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-data)" stopOpacity={0.8} />
            <stop
              offset="95%"
              stopColor="var(--color-data)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="data"
          type="natural"
          fill="url(#fillData)"
          fillOpacity={0.4}
          stroke="var(--color-data)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

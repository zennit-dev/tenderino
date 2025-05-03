"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@zennui/web/chart/chart";
import { Area, AreaChart } from "recharts";

type ChartDataPoint = {
  month: string;
  data: number;
};

type DashboardLineChartProps = {
  chartConfig: ChartConfig;
  chartData?: ChartDataPoint[];
};

export const DashboardLineChart = ({
  chartConfig,
  chartData,
}: DashboardLineChartProps) => {
  if (!chartConfig.data?.color) {
    return null;
  }

  const color = chartConfig.data.color;

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
          <linearGradient id={`fillData-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="data"
          type="natural"
          fill={`url(#fillData-${color})`}
          fillOpacity={0.6}
          stroke={color}
          strokeWidth={2}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

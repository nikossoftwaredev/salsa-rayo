"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

interface SubscriptionPieChartProps {
  data: { name: string; count: number }[]
}

export const SubscriptionPieChart = ({ data }: SubscriptionPieChartProps) => {
  const chartConfig = data.reduce<ChartConfig>((acc, item, i) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[i % COLORS.length],
    }
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>Active subscriptions by plan</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-12">
            No active subscriptions
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

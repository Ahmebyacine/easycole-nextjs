"use client";

import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  YAxis,
  LabelList,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrencyDZD } from "@/utils/formatCurrency";

// Bar chart for paid/unpaid revenue
export function RevenueBarChart({ data, isCourse = false }) {
  return (
    <ChartContainer
      config={{
        totalPaid: { label: "المبلغ المدفوع", color: "var(--chart-2)" },
        totalUnpaid: { label: "المبلغ غير المدفوع", color: "var(--chart-1)" },
      }}
      className={`h-full w-full ${isCourse ? "min-w-[1200px]" : "min-w-[500px]"}`}
    >
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ left: 10 }}
        barGap={0}
        height={600}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={90}
          tick={{ fontSize: 11, padding: 8 }}
        />
        <YAxis type="number" />
        <ChartTooltip
          cursor
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => formatCurrencyDZD(value)}
            />
          }
        />
        <Bar dataKey="totalPaid" fill="var(--color-totalPaid)" radius={4}>
          <LabelList
            dataKey="totalPaid"
            position="top"
            className="fill-foreground"
            fontSize={10}
            formatter={(v) => formatCurrencyDZD(v)}
          />
        </Bar>
        <Bar dataKey="totalUnpaid" fill="var(--color-totalUnpaid)" radius={4}>
          <LabelList
            dataKey="totalUnpaid"
            position="top"
            className="fill-foreground"
            fontSize={10}
            formatter={(v) => formatCurrencyDZD(v)}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// Pie chart for payment status
export function PaymentStatusPieChart({ data, colors }) {
  return (
    <ChartContainer
      config={{ value: { label: "القيمة" } }}
      className="aspect-square h-full w-full"
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={false}
          label={({ name, percent }) => `%${name}: ${(percent * 100).toFixed(0)}`}
          dataKey="value"
        >
          {data?.map((entry, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v) => formatCurrencyDZD(v)}
              indicator="square"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}

// Area chart for monthly trends
export function MonthlyTrendChart({ data }) {
  return (
    <ChartContainer
      config={{
        totalTrainees: { label: "إجمالي المتدربين", color: "var(--chart-3)" },
        totalAmount: { label: "إجمالي المبلغ (آلاف د.ج)", color: "var(--chart-1)" },
      }}
      className="h-full w-full min-w-[800px]"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillTrainees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-totalTrainees)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-totalTrainees)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-totalAmount)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-totalAmount)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
        <ChartTooltip cursor={false} />
        <Area
          dataKey="totalTrainees"
          type="natural"
          fill="url(#fillTrainees)"
          stroke="var(--color-totalTrainees)"
          stackId="a"
        />
        <Area
          dataKey="totalAmount"
          type="natural"
          fill="url(#fillAmount)"
          stroke="var(--color-totalAmount)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

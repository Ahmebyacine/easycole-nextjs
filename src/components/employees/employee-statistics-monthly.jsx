"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { MONTHS_ORDER } from "@/assets/data";
import { MonthlyTrendChart } from "@/components/charts";
import EmployeeStatisticsTable from "./employee-statistics-table";

export default function EmployeeStatisticsMonthly({ data }) {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toLocaleString("en-US", { month: "long" })
  );

  const monthlyData = useMemo(() => {
    if (!data?.statistics?.length) return [];
    const stats = data.statistics.flatMap((stat) =>
      stat.performance.monthlyData.map((month) => ({
        month: month.month,
        totalTrainees: month.totalTrainees,
        totalAmount: month.totalAmount,
        paid: month.paid,
        unpaid: month.unpaid,
      }))
    );

    return MONTHS_ORDER.map((month) => {
      const monthStats = stats.filter((s) => s.month === month.value);
      const totalAmount = monthStats.reduce((a, s) => a + s.totalAmount, 0);
      const paid = monthStats.reduce((a, s) => a + s.paid, 0);
      const unpaid = monthStats.reduce((a, s) => a + s.unpaid, 0);
      const totalTrainees = monthStats.reduce((a, s) => a + s.totalTrainees, 0);
      return { month, totalAmount, paid, unpaid, totalTrainees };
    });
  }, [data]);

  const currentMonthStats = useMemo(() => {
    if (!data?.statistics?.length) return [];
    return data.statistics.map((stat) => {
      const m = stat.performance.monthlyData.find((m) => m.month === selectedMonth);
      return {
        employee: stat.employee,
        totalAmount: m?.totalAmount || 0,
        totalPaid: m?.totalPaid || 0,
        totalUnpaid: m?.totalUnpaid || 0,
        totalTrainees: m?.totalTrainees || 0,
      };
    });
  }, [data, selectedMonth]);

  if (!data?.statistics?.length)
    return <p className="text-center mt-6">لا توجد بيانات متاحة.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-row-reverse items-center">
        <h3 className="text-xl font-semibold">الإحصائيات الشهرية</h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="اختر الشهر" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS_ORDER.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تطور الإيرادات الشهرية</CardTitle>
          <CardDescription>تحليل الاتجاهات على مدار السنة</CardDescription>
        </CardHeader>
        <CardContent className="h-96 overflow-x-auto">
          <MonthlyTrendChart data={monthlyData} />
        </CardContent>
      </Card>

      <EmployeeStatisticsTable statistics={currentMonthStats} type="monthly" showTotal />
    </div>
  );
}

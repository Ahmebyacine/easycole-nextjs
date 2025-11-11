"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { RevenueBarChart } from "@/components/charts";
import EmployeeStatisticsTable from "./employee-statistics-table";

export default function EmployeeStatisticsYearly({ data, selectedYear }) {
  if (!data?.statistics?.length)
    return <p className="text-center mt-6">لا توجد بيانات متاحة.</p>;

  const yearlyChartData = data.statistics.map((stat) => ({
    name: stat.employee?.name || "غير معروف",
    totalAmount: stat?.performance?.yearlyTotal?.totalAmount || 0,
    totalPaid: stat?.performance?.yearlyTotal?.totalPaid || 0,
    totalUnpaid: stat?.performance?.yearlyTotal?.totalUnpaid || 0,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على الإيرادات لسنة {selectedYear}</CardTitle>
          <CardDescription>الإيرادات الكاملة وحالة المدفوعات</CardDescription>
        </CardHeader>
        <CardContent className="h-96 overflow-x-auto">
          <RevenueBarChart data={yearlyChartData} />
        </CardContent>
      </Card>

      <EmployeeStatisticsTable statistics={data.statistics} type="yearly" showTotal />
    </div>
  );
}

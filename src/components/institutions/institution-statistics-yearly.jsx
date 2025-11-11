"use-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { RevenueBarChart } from "../charts";
import InstitutionStatisticsTable from "./institution-statistics-table";

export default function InstitutionStatisticsYearly({ data, selectedYear }) {
  if (!data?.statistics?.length)
    return <p className="text-center mt-6">لا توجد بيانات متاحة.</p>;

  const yearlyChartData = data.statistics.map((stat) => ({
    name: stat.institution?.name || "غير معروف",
    total: stat.yearlyTotal?.totalAmount || 0,
    totalPaid: stat.yearlyTotal?.totalPaid || 0,
    totalUnpaid: stat.yearlyTotal?.totalUnpaid || 0,
  }));
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على الإيرادات لسنة {selectedYear}</CardTitle>
          <CardDescription>الإيرادات الكاملة وحالة المدفوعات</CardDescription>
        </CardHeader>
        <CardContent className="h-96 overflow-x-auto">
          <RevenueBarChart data={yearlyChartData} isCourse={false} />
        </CardContent>
      </Card>

      <InstitutionStatisticsTable
        statistics={data.statistics}
        type="yearly"
        showTotal
      />
    </div>
  );
}

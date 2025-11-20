"use client";

import { BarChart3 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import ProgramStatisticsCard from "@/components/programs/program-statistics-card";

export default function ProgramStatisticsPage() {
  const { data: statistics, loading, error } = useFetch("/api/programs/statistics/employee");

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-lg">جاري تحميل إحصائيات البرامج...</p>
      </div>
    );
  }

  //if (error) return <ErrorPage error={error} />;k
  return (
    <div className="container mx-auto p-5 md:p-10">
      {statistics && statistics.length > 0 ? (
        <div className="space-y-6 text-right">
          {statistics.map((statistic) => (
            <ProgramStatisticsCard key={statistic.program.id} data={statistic} isEmployee />
          ))}
        </div>
      ) : (
        <div className="text-center border border-dashed rounded-lg p-8">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا توجد بيانات متاحة</h3>
          <p className="text-muted-foreground">لم يتم العثور على أي إحصائيات للبرامج</p>
        </div>
      )}
    </div>
  );
}

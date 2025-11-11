"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseStatisticsMonthly } from "@/components/courses/course-statistics-monthly";
import { CourseStatisticsYearly } from "@/components/courses/course-statistics-yearly";
import { availableYears } from "@/assets/data";
import useFetch from "@/hooks/use-fetch";

export default function CourseStatistics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, error, loading } = useFetch(
    `/api/courses/statistics/monthly?year=${selectedYear}`
  );

  // if (error) return <ErrorPage error={error} />;

  if (loading) {
    return (
      <div className="text-center py-4">جاري تحميل البيانات...</div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-3xl font-bold mb-6 text-right">
        لوحة إحصائيات الدورات
      </h1>

      {/* Year Selector */}
      <div className="flex flex-row items-center justify-between mb-6">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[180px] text-right">
            <SelectValue placeholder="اختر السنة" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="text-right"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="yearly">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="monthly">تفصيل شهري</TabsTrigger>
          <TabsTrigger value="yearly">نظرة سنوية</TabsTrigger>
        </TabsList>

        <TabsContent value="yearly">
          <CourseStatisticsYearly
            selectedYear={selectedYear}
            yearlyData={data}
          />
        </TabsContent>

        <TabsContent value="monthly">
          <CourseStatisticsMonthly
            selectedYear={selectedYear}
            monthlyData={data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

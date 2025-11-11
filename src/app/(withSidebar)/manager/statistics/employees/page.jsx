"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import EmployeeStatisticsYearly from "@/components/employees/employee-statistics-yearly";
import EmployeeStatisticsMonthly from "@/components/employees/employee-statistics-monthly";
import { availableYears } from "@/assets/data";

export default function EmployeeStatistics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, error, loading } = useFetch(
    `/api/users/statistics/manager?year=${selectedYear}`
  );

  // if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  if (loading)
    return <p className="text-center mt-6">جاري تحميل البيانات...</p>;
  console.log(data)
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إحصائيات الموظفين</h1>
        <Select
          value={String(selectedYear)}
          onValueChange={(val) => setSelectedYear(Number(val))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="اختر السنة" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4">
        <Tabs defaultValue="yearly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">تفصيل شهري</TabsTrigger>
            <TabsTrigger value="yearly">نظرة عامة سنوية</TabsTrigger>
          </TabsList>

          <TabsContent value="yearly">
            <EmployeeStatisticsYearly
              data={data}
              selectedYear={selectedYear}
            />
          </TabsContent>

          <TabsContent value="monthly">
            <EmployeeStatisticsMonthly data={data} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

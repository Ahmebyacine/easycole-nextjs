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
import InstitutionStatisticsYearly from "@/components/institutions/institution-statistics-yearly";
import InstitutionStatisticsMonthly from "@/components/institutions/institutions-statistics-monthly";
import { availableYears } from "@/assets/data";

export default function InstitutionStatistics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data, error, loading } = useFetch(
    `/api/institutions/statistics?year=${selectedYear}`
  );

  //if (error) return <p className="text-red-500 text-center mt-4">حدث خطأ أثناء تحميل البيانات</p>;

  if (loading) {
    return (
      <div className="text-center py-4">جاري تحميل البيانات...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إحصائيات المؤسسات</h1>
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
            <TabsTrigger value="monthly">تفاصيل شهرية</TabsTrigger>
            <TabsTrigger value="yearly">نظرة عامة سنوية</TabsTrigger>
          </TabsList>

          <TabsContent value="yearly">
            <InstitutionStatisticsYearly
              data={data}
              selectedYear={selectedYear}
            />
          </TabsContent>

          <TabsContent value="monthly">
            <InstitutionStatisticsMonthly data={data}/>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

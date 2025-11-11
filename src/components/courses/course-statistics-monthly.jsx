'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MonthlyTrendChart } from '../charts';
import { MONTHS_ORDER } from '@/assets/data';
import { CourseStatisticsTable } from './course-statistics-table';

export function CourseStatisticsMonthly({ selectedYear, monthlyData }) {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toLocaleString('en-US', { month: 'long' })
  );

  // Always call hooks before any return
  const monthlyTrendData = useMemo(() => {
    if (!monthlyData?.statistics) return [];
    const aggregation = monthlyData.statistics.reduce((acc, course) => {
      course.monthlyData.forEach((monthData) => {
        const { month, totalTrainees, totalAmount, totalPaid, totalUnpaid } = monthData;
        if (!acc[month]) {
          acc[month] = { name: month, totalTrainees: 0, totalAmount: 0, totalPaid: 0, totalUnpaid: 0 };
        }
        acc[month].totalTrainees += totalTrainees;
        acc[month].totalAmount += totalAmount;
        acc[month].totalPaid += totalPaid;
        acc[month].totalUnpaid += totalUnpaid;
      });
      return acc;
    }, {});

    return Object.values(aggregation)
      .sort((a, b) => MONTHS_ORDER.indexOf(a.name) - MONTHS_ORDER.indexOf(b.name))
      .map((month) => ({
        ...month,
        totalAmount: month.totalAmount / 1000,
      }));
  }, [monthlyData]);

  const currentMonthStats = useMemo(() => {
    if (!monthlyData?.statistics) return [];
    return monthlyData.statistics.map((course) => {
      const entry = course.monthlyData.find((m) => m.month === selectedMonth);
      return {
        course: course.course,
        totalTrainees: entry?.totalTrainees || 0,
        totalAmount: entry?.totalAmount || 0,
        totalPaid: entry?.totalPaid || 0,
        totalUnpaid: entry?.totalUnpaid || 0,
      };
    });
  }, [monthlyData, selectedMonth]);

  if (!monthlyData?.statistics?.length) {
    return (
      <div className="text-center py-4 text-destructive">
        لا توجد بيانات متاحة لسنة {selectedYear}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
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

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>التوجهات الشهرية لسنة {selectedYear}</CardTitle>
          <CardDescription>المتدربون والإيرادات حسب الشهر</CardDescription>
        </CardHeader>
        <CardContent className="h-80 overflow-x-auto">
          <MonthlyTrendChart data={monthlyTrendData} />
        </CardContent>
      </Card>

      {/* Month Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            إحصائيات الدورة لشهر {selectedMonth} سنة {selectedYear}
          </CardTitle>
          <CardDescription>تفصيل حسب الدورة</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseStatisticsTable type='monthly' statistics={currentMonthStats} showTotal />
        </CardContent>
      </Card>
    </div>
  );
}

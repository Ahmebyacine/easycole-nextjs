'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueBarChart } from '../charts';
import { CourseStatisticsTable } from './course-statistics-table';

export function CourseStatisticsYearly({ selectedYear, yearlyData}) {

  if (!yearlyData?.statistics?.length) {
    return (
      <div className="text-center py-4 text-destructive">
        لا توجد بيانات متاحة لسنة {selectedYear}
      </div>
    );
  }

  const yearlyChartData = yearlyData.statistics.map((stat) => ({
    name: stat.course.name,
    totalAmount: stat.yearlyTotal.totalAmount,
    totalPaid: stat.yearlyTotal.totalPaid,
    totalUnpaid: stat.yearlyTotal.totalUnpaid,
  }));

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            نظرة عامة على الإيرادات لسنة {selectedYear}
          </CardTitle>
          <CardDescription>
            الإيرادات الكاملة وحالة المدفوعات
          </CardDescription>
        </CardHeader>
        <CardContent className="h-90 overflow-x-auto">
          <RevenueBarChart data={yearlyChartData} isCourse />
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">
            إحصائيات الدورات لسنة {selectedYear}
          </CardTitle>
          <CardDescription className="text-right">تفصيل حسب كل دورة</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseStatisticsTable type="yearly" statistics={yearlyData.statistics} showTotal />
        </CardContent>
      </Card>
    </div>
  );
}

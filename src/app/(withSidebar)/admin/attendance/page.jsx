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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";

const today = new Date();
const currentYear = today.getFullYear();
const formatDate = (d) => d.toISOString().slice(0, 10);

const availableMonths = [
  { value: "01", label: "يناير" },
  { value: "02", label: "فبراير" },
  { value: "03", label: "مارس" },
  { value: "04", label: "أبريل" },
  { value: "05", label: "مايو" },
  { value: "06", label: "يونيو" },
  { value: "07", label: "يوليو" },
  { value: "08", label: "أغسطس" },
  { value: "09", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

const availableYears = Array.from({ length: currentYear - 2025 + 1 }, (_, i) => 2025 + i);

function DailyAttendanceTable({ date }) {
  const { data: dailyData = [], loading, error } = useFetch(
    `/api/attendance/daily?date=${date}`
  );

  if (loading) return <div className="text-center py-4">جاري تحميل البيانات...</div>;
  if (error) return <div className="text-center py-4 text-destructive">{error}</div>;

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">الموظف</TableHead>
          <TableHead className="text-right">تسجيل الدخول</TableHead>
          <TableHead className="text-right">تسجيل الخروج</TableHead>
          <TableHead className="text-right">عدد الساعات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dailyData.length > 0 ? (
          dailyData.map((row) => (
            <TableRow key={row.userId}>
              <TableCell>{row?.name || row.userId}</TableCell>
              <TableCell>{row.checkIn || "-"}</TableCell>
              <TableCell>{row.checkOut || "-"}</TableCell>
              <TableCell>{row.workedHours.toFixed(2)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              لا توجد بيانات
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function MonthlyAttendanceTable({ month }) {
  const { data: monthlyData = [], loading, error } = useFetch(
    `/api/attendance/monthly?month=${month}`
  );

  const downloadReport = async (userId) => {
    try {
      const res = await fetch(
        `/api/attendance/report?userId=${encodeURIComponent(userId)}&month=${month}`
      );
      if (!res.ok) throw new Error("فشل تحميل التقرير PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${userId}-${month}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-4">جاري تحميل البيانات...</div>;
  if (error) return <div className="text-center py-4 text-destructive">{error}</div>;

  return (
    <div>
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الموظف</TableHead>
            <TableHead className="text-right">عدد أيام العمل</TableHead>
            <TableHead className="text-right">إجمالي ساعات العمل</TableHead>
            <TableHead className="text-right">تحميل التقرير</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthlyData?.length > 0 ? (
            monthlyData?.map((row) => (
              <TableRow key={row.userId}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.totalDaysWorked || 0}</TableCell>
                <TableCell>{(row.totalHoursWorked || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => downloadReport(row.userId)}>
                    تحميل التقرير
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AttendancePage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(today.toISOString().slice(5, 7));
  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  const builtMonth = `${selectedYear}-${selectedMonth}`;

  return (
    <div>
      <h1 className="text-xl md:text-3xl font-bold mb-6 text-right">
        لوحة إحصائيات الحضور
      </h1>

      {/* Selectors */}
      <div className="flex flex-row items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          {/* Year Selector */}
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[140px] text-right">
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-right">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Selector */}
          <Select
            value={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
          >
            <SelectTrigger className="w-[140px] text-right">
              <SelectValue placeholder="اختر الشهر" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-right">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date picker for daily tab */}
          <input
            type="date"
            value={selectedDate}
            max={formatDate(today)}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm h-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" dir="rtl">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="daily">الحضور اليومي</TabsTrigger>
          <TabsTrigger value="monthly">التقرير الشهري</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <DailyAttendanceTable date={selectedDate} />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyAttendanceTable month={builtMonth} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
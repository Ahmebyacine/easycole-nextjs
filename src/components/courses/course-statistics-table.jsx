"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyDZD } from "@/utils/formatCurrency";

export const CourseStatisticsTable = ({ statistics, showTotal = false, type = "yearly" }) => {
  if (!statistics?.length)
    return (
      <div className="text-center py-4 text-destructive">
        لا توجد بيانات متاحة لعرضها
      </div>
    );

  // Normalize data shape
  const normalizedStats = statistics.map((stat) => {
    if (type === "yearly") {
      return {
        id: stat.course?._id,
        name: stat.course?.name,
        totalTrainees: stat.yearlyTotal?.totalTrainees || 0,
        totalAmount: stat.yearlyTotal?.totalAmount || 0,
        totalPaid: stat.yearlyTotal?.totalPaid || 0,
        totalUnpaid: stat.yearlyTotal?.totalUnpaid || 0,
      };
    }
    // monthly
    return {
      id: stat.course?._id,
      name: stat.course?.name,
      totalTrainees: stat.totalTrainees || 0,
      totalAmount: stat.totalAmount || 0,
      totalPaid: stat.totalPaid || 0,
      totalUnpaid: stat.totalUnpaid || 0,
    };
  });

  // Totals
  const totals = normalizedStats.reduce(
    (acc, s) => {
      acc.totalTrainees += s.totalTrainees;
      acc.totalAmount += s.totalAmount;
      acc.totalPaid += s.totalPaid;
      acc.totalUnpaid += s.totalUnpaid;
      return acc;
    },
    { totalTrainees: 0, totalAmount: 0, totalPaid: 0, totalUnpaid: 0 }
  );

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead>اسم الدورة</TableHead>
          <TableHead>عدد المتدربين</TableHead>
          <TableHead>المبلغ الإجمالي (د.ج)</TableHead>
          <TableHead>المبلغ المدفوع (د.ج)</TableHead>
          <TableHead>المبلغ المتبقي (د.ج)</TableHead>
          <TableHead>نسبة الدفع</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {normalizedStats.map((stat,i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{stat.name}</TableCell>
            <TableCell>{stat.totalTrainees}</TableCell>
            <TableCell>
              {formatCurrencyDZD(stat.totalAmount)}
            </TableCell>
            <TableCell>
              {formatCurrencyDZD(stat.totalPaid)}
            </TableCell>
            <TableCell>
              {formatCurrencyDZD(stat.totalUnpaid)}
            </TableCell>
            <TableCell>
              {stat.totalAmount > 0
                ? `${((stat.totalPaid / stat.totalAmount) * 100).toFixed(0)}%`
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}

        {showTotal && (
          <TableRow className="font-bold">
            <TableCell>المجموع</TableCell>
            <TableCell>{totals.totalTrainees}</TableCell>
            <TableCell>
              {formatCurrencyDZD(totals.totalAmount)}
            </TableCell>
            <TableCell>
              {formatCurrencyDZD(totals.totalPaid)}
            </TableCell>
            <TableCell>
              {formatCurrencyDZD(totals.totalUnpaid)}
            </TableCell>
            <TableCell>
              {totals.totalAmount > 0
                ? `${((totals.totalPaid / totals.totalAmount) * 100).toFixed(0)}%`
                : "N/A"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

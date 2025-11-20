"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateDuration, formatDate } from "@/utils/formatSafeDate";
import { formatCurrencyDZD } from "@/utils/formatCurrency";
import Link from "next/link";

export default function ProgramStatisticsCard({ data, isEmployee = false }) {
  const startDate = new Date(data.program.startDate);
  const endDate = new Date(data.program.endDate);

  const paidPercentage = data.totalAmount
    ? Math.round((data.totalPaid / data.totalAmount) * 100)
    : 0;
  const unpaidPercentage = data.totalAmount
    ? Math.round((data.totalUnpaid / data.totalAmount) * 100)
    : 0;

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader className="flex flex-col items-start space-y-2">
        <CardTitle className="text-2xl text-right">
          برنامج {data.program.courseName}
        </CardTitle>
        <CardDescription className="text-right">
          {data.program.institutionName}
        </CardDescription>

        <Button variant="outline" className="w-full">
          <Link
            href={ isEmployee ? `/employee/program-report/${data.program.id}` : `/program-report/${data.program.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.open(e.currentTarget.href, "_blank");
            }}
            className="block w-full h-full"
          >
            تقرير البرنامج
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Trainees */}
          <StatisticBox
            label="المتدربين"
            icon={<Users className="h-4 w-4" />}
            value={data.totalTrainees}
          />

          {/* Total Amount */}
          <StatisticBox
            label="المبلغ الإجمالي"
            icon={<DollarSign className="h-4 w-4" />}
            value={formatCurrencyDZD(data.totalAmount)}
          />

          {/* Paid */}
          <StatisticBox
            label="المدفوع"
            icon={<CheckCircle className="h-4 w-4" />}
            value={formatCurrencyDZD(data.totalPaid)}
            color="text-green-600"
            note={`${paidPercentage}% من الإجمالي`}
          />

          {/* Unpaid */}
          <StatisticBox
            label="غير المدفوع"
            icon={<XCircle className="h-4 w-4" />}
            value={formatCurrencyDZD(data.totalUnpaid)}
            color="text-red-600"
            note={`${unpaidPercentage}% من الإجمالي`}
          />
        </div>

        {/* Duration */}
        <div className="mt-6 rounded-lg border p-4">
          <div className="flex items-center justify-start space-x-2 text-muted-foreground mb-2">
            <span className="text-sm font-medium">مدة البرنامج</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="text-sm text-right">
            {formatDate(startDate)} - {formatDate(endDate)}
            <span className="ml-2 text-muted-foreground">
              ({calculateDuration(startDate, endDate)})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatisticBox({ label, icon, value, color = "text-muted-foreground", note }) {
  return (
    <div className="flex flex-col space-y-2 rounded-lg border p-4">
      <div className={`flex items-center justify-start space-x-2 ${color}`}>
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-right">{value}</div>
      {note && (
        <div className="text-sm text-muted-foreground text-right">{note}</div>
      )}
    </div>
  );
}

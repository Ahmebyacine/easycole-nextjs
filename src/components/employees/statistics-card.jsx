"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrencyDZD } from "@/utils/formatCurrency"
import { DollarSign, CheckCircle, XCircle, Calendar } from "lucide-react"

export default function StatisticsCard({ data }) {

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl text-right">{data.user.name}</CardTitle>
        <CardDescription className="text-right">{data.user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-end space-x-2 text-muted-foreground">
              <span className="text-sm font-medium">المبلغ الإجمالي</span>
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-left">{formatCurrencyDZD(data.statistics.totalAmount)}</div>
          </div>

          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-end space-x-2 text-green-600">
              <span className="text-sm font-medium">المدفوع</span>
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-left">{formatCurrencyDZD(data.statistics.totalPaid)}</div>
            <div className="text-sm text-muted-foreground text-left">
              {Math.round((data.statistics.totalPaid / data.statistics.totalAmount) * 100)}% من الإجمالي
            </div>
          </div>

          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-end space-x-2 text-red-600">
              <span className="text-sm font-medium">غير المدفوع</span>
              <XCircle className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-left">{formatCurrencyDZD(data.statistics.totalUnpaid)}</div>
            <div className="text-sm text-muted-foreground text-left">
              {Math.round((data.statistics.totalUnpaid / data.statistics.totalAmount) * 100)}% من الإجمالي
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border p-4">
          <div className="flex items-center justify-start space-x-2 text-muted-foreground mb-2">
            <span className="text-sm font-medium">فترة الإحصائيات</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="text-sm text-right">
            {data.year} {data.monthName}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
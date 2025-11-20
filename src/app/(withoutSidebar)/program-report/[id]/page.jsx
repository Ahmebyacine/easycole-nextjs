"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Users, AlertCircle } from "lucide-react";
import { formatDate } from "@/utils/formatSafeDate";
import { formatCurrencyDZD } from "@/utils/formatCurrency";

export default function ProgramReportPage() {
  const params = useParams();
  const id = params?.id;
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEmployee, setActiveEmployee] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/programs/${id}/report`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "حدث خطأ أثناء تحميل التقرير");
        }
        const data = await res.json();
        setReportData(data);
        setActiveEmployee(data?.employees?.[0]?.employee?.id || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center" dir="rtl">
        جاري تحميل تقرير البرنامج...
      </div>
    );
  }

  //if (error) return <ErrorPage error={error} />

  const { program, summary, employees } = reportData || {};

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Program Header */}
      <Card className="mb-8" dir="rtl">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-2xl md:text-3xl">
              {program?.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {program?.institution}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem
              icon={<Calendar />}
              label="تاريخ البداية"
              value={formatDate(program.start_date)}
            />
            <InfoItem
              icon={<Calendar />}
              label="تاريخ النهاية"
              value={formatDate(program.end_date)}
            />
            <InfoItem
              icon={<Users />}
              label="عدد المتدربين"
              value={summary.totalTrainees}
            />
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-4">ملخص البرنامج</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Summary
                label="المبلغ المدفوع"
                value={formatCurrencyDZD(summary.totalPaid)}
                color="text-green-600"
              />
              <Summary
                label="المبلغ المتبقي"
                value={formatCurrencyDZD(summary.totalUnpaid)}
                color="text-red-600"
              />
              <Summary
                label="المبلغ الإجمالي"
                value={formatCurrencyDZD(summary.totalPrice)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees & Trainees */}
      <Tabs
        defaultValue={activeEmployee}
        onValueChange={setActiveEmployee}
        className="mt-6"
      >
        <TabsList className="mb-4 w-full flex overflow-x-auto">
          {employees.map((emp) => (
            <TabsTrigger
              key={emp.employee.id}
              value={emp.employee.id}
              className="flex-1 min-w-[150px]"
            >
              {emp.employee.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {employees.map((emp) => (
          <TabsContent key={emp.employee.id} value={emp.employee.id}>
            <Card>
              <CardHeader>
                <div
                  className="flex flex-col md:flex-row justify-between gap-4"
                  dir="rtl"
                >
                  <div>
                    <CardTitle>{emp.employee.name}</CardTitle>
                    <CardDescription>{emp.employee.email}</CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <InfoBox
                      label="المتدربين"
                      value={emp.summary.totalTrainees}
                    />
                    <InfoBox
                      label="المبلغ المحصل"
                      value={formatCurrencyDZD(emp.summary.totalPaid)}
                      color="text-green-600"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-md border">
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>المبلغ المدفوع</TableHead>
                        <TableHead>المبلغ المتبقي</TableHead>
                        <TableHead>المبلغ الإجمالي</TableHead>
                        <TableHead>ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emp.trainees.map((t, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell className="font-medium">
                            {t.name}
                          </TableCell>
                          <TableCell className="text-left" >{t.email}</TableCell>
                          <TableCell className="text-right" dir="ltr">
                            {t.phone}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {t.paidAmount.toLocaleString()} دج
                          </TableCell>
                          <TableCell className="text-red-600">
                            {t.unpaidAmount.toLocaleString()} دج
                          </TableCell>
                          <TableCell>
                            {t.totalPrice.toLocaleString()} دج
                          </TableCell>
                          <TableCell>
                            {t.note ? (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs">{t.note}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Employee Summary */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg" dir="rtl">
                  <h3 className="text-lg font-medium mb-4">ملخص المشرف</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Summary
                      label="المبلغ المدفوع"
                      value={formatCurrencyDZD(emp.summary.totalPaid)}
                      color="text-green-600"
                    />
                    <Summary
                      label="المبلغ المتبقي"
                      value={formatCurrencyDZD(emp.summary.totalUnpaid)}
                      color="text-red-600"
                    />
                    <Summary
                      label="المبلغ الإجمالي"
                      value={formatCurrencyDZD(emp.summary.totalPrice)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {Icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Summary({ label, value, color }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${color || ""}`}>
        {value.toLocaleString()}{" "}
      </p>
    </div>
  );
}

function InfoBox({ label, value, color }) {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${color || ""}`}>{value}</p>
    </div>
  );
}

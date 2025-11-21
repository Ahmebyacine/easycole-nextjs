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
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getPaymentMethodLabel } from "@/utils/getPaymentMethodLabel";
import { formatDate } from "@/utils/formatSafeDate";
import { formatCurrencyDZD } from "@/utils/formatCurrency";

export default function ProgramReportEmployeePage() {
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
        const res = await fetch(`/api/programs/${id}/report/employees`, {
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

  const confirmPayment = async (traineeId) => {
    try {
      const res = await fetch(
        `/api/trainees/confirm-second-tranche/${traineeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Request failed");
      }

      const updated = await res.json();

      const updatedTrainee = {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        inialTranche: updated.inialTranche || 0,
        secondTranche: updated.secondTranche || 0,
        methodePaiement1: updated.methodePaiement1,
        methodePaiement2: updated.methodePaiement2,
        totalPrice: updated.totalPrice || 0,
        paidAmount: (updated.inialTranche || 0) + (updated.secondTranche || 0),
        unpaidAmount:
          updated.rest ??
          (updated.totalPrice || 0) -
            ((updated.inialTranche || 0) + (updated.secondTranche || 0)),
        note: updated.note || "",
      };

      setReportData((prevData) => {
        if (!prevData) return prevData;

        const newEmployees = prevData.employees.map((emp) => ({
          ...emp,
          trainees: emp.trainees.map((t) =>
            t.id === updatedTrainee.id ? updatedTrainee : t
          ),
        }));

        return { ...prevData, employees: newEmployees };
      });

      toast.success("تم التحديث بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">جاري تحميل تقرير البرنامج...</div>
      </div>
    );
  }

  //if (error) return <ErrorPage error={error} />;

  const { program, summary, employees } = reportData || {};

  return (
    <div className="py-6 px-4 md:px-">
      {/* Program Header */}
      <Card className="mb-8">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl md:text-3xl">
            {program?.name}
          </CardTitle>
          <CardDescription className="text-lg">
            {program?.institution}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="تاريخ البداية"
              value={formatDate(program?.start_date)}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="تاريخ النهاية"
              value={formatDate(program?.end_date)}
            />
            <InfoItem
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
              label="عدد المتدربين"
              value={summary?.totalTrainees}
            />
          </div>

          {/* Program Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-4">ملخص البرنامج</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Summary
                label="المبلغ المدفوع"
                value={summary?.totalPaid}
                color="text-green-600"
              />
              <Summary
                label="المبلغ المتبقي"
                value={summary?.totalUnpaid}
                color="text-red-600"
              />
              <Summary label="المبلغ الإجمالي" value={summary?.totalPrice} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees and Trainees */}
      <Tabs
        defaultValue={activeEmployee}
        onValueChange={setActiveEmployee}
        className="mt-6"
      >
        <TabsList className="mb-4 w-full flex overflow-x-auto">
          {employees?.map((emp) => (
            <TabsTrigger
              key={emp.employee.id}
              value={emp.employee.id}
              className="flex-1 min-w-[150px]"
            >
              {emp.employee.name}
              <Badge variant="outline" className="mr-2 bg-primary/10">
                {emp.summary.totalTrainees}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {employees.map((emp) => (
          <TabsContent key={emp.employee.id} value={emp.employee.id}>
            <Card dir="rtl">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
                      value={emp.summary.totalPaid}
                      color="text-green-600"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="max-w-full overflow-x-auto">
                <div className="rounded-md border">
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>القسط الاول</TableHead>
                        <TableHead>القسط الثاني</TableHead>
                        <TableHead>المبلغ المتبقي</TableHead>
                        <TableHead>المبلغ الإجمالي</TableHead>
                        <TableHead>الإجراءات</TableHead>
                        <TableHead>ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {emp?.trainees?.map((trainee, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {trainee.name}
                          </TableCell>
                          <TableCell>{trainee.email}</TableCell>
                          <TableCell dir="ltr">{trainee.phone}</TableCell>

                          <TableCell className="text-green-600">
                            {formatCurrencyDZD(trainee.inialTranche || 0)}
                            <br />
                            <span className="text-xs">
                              {getPaymentMethodLabel(trainee.methodePaiement1)}
                            </span>
                          </TableCell>

                          <TableCell className="text-green-600">
                            {formatCurrencyDZD(trainee.secondTranche || 0)}
                            <br />
                            <span className="text-xs">
                              {getPaymentMethodLabel(trainee.methodePaiement2)}
                            </span>
                          </TableCell>

                          <TableCell className="text-red-600">
                            {formatCurrencyDZD(trainee.unpaidAmount || 0)}
                          </TableCell>

                          <TableCell>
                            {formatCurrencyDZD(trainee.totalPrice || 0)}
                          </TableCell>

                          <TableCell>
                            <Button
                              onClick={() => confirmPayment(trainee.id)}
                              disabled={!trainee.unpaidAmount}
                              className="bg-green-700"
                              size="sm"
                            >
                              تأكيد الدفعة الثانية
                            </Button>
                          </TableCell>

                          <TableCell>
                            {trainee.note ? (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs">{trainee.note}</span>
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
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">ملخص المشرف</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        المبلغ المدفوع
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrencyDZD(emp.summary.totalPaid)}
                      </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        المبلغ المتبقي
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrencyDZD(emp.summary.totalUnpaid)}
                      </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        المبلغ الإجمالي
                      </p>
                      <p className="text-xl font-bold">
                        {formatCurrencyDZD(emp.summary.totalPrice)}
                      </p>
                    </div>
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
        {(value || 0).toLocaleString()} دج
      </p>
    </div>
  );
}

function InfoBox({ label, value, color }) {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${color || ""}`}>
        {(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

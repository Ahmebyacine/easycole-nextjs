"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Phone } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatSafeDate";
import useFetch from "@/hooks/use-fetch";
import WhitelistModal from "@/components/employees/whitelist-modal";

export default function Lead() {


  const { data: programs } = useFetch("/api/programs/employee");
  const { data: leads, setData: setLeads, loading } = useFetch("/api/leads/employee");

  const calledLead = async (lead) => {
    try {
      const updated = await fetchJSON(`/api/leads/${lead._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "called" }),
      });

      setLeads((prev) => prev.map((l) => (l._id === lead._id ? updated : l)));
      toast.success("تم تحديث حالة العميل إلى 'تم الاتصال'");
    } catch {
      toast.error("حدث خطأ أثناء تحديث حالة العميل");
    }
  };

  const confirmLead = async (lead) => {
    try {
      await fetchJSON("/api/whitelists", {
        method: "POST",
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          program: lead.program,
          notes: lead.notes,
        }),
      });

      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      toast.success("تم تحويل القيد إلى قائمة التسجيل بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تأكيد القيد");
    }
  };

  const canceledLead = async (lead) => {
    try {
      const updated = await fetchJSON(`/api/leads/${lead._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "canceled" }),
      });

      setLeads((prev) => prev.map((l) => (l._id === lead._id ? updated : l)));
      toast.success("تم إلغاء القيد");
    } catch {
      toast.error("حدث خطأ أثناء إلغاء القيد");
    }
  };

  const groupedLeads = leads?.reduce((acc, lead) => {
    const id = lead.course?._id;
    if (!acc[id]) {
      acc[id] = {
        courseName: lead.course?.name || "بدون دورة",
        coursePrice: lead.course?.price || 0,
        leads: [],
      };
    }
    acc[id].leads.push(lead);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );

  //if (error) return <ErrorPage error={error} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">قائمة العملاء المحتملين</h1>
          <p className="text-muted-foreground">إدارة العملاء قبل التسجيل</p>
        </div>
      </div>

      {leads?.length === 0 && (
        <div className="text-center text-muted-foreground">
          لا يوجد عملاء محتملين حالياً.
        </div>
      )}

      {Object.entries(groupedLeads).map(([courseId, group]) => (
        <div key={courseId} className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold">{group.courseName}</h2>
            <p className="text-l">السعر: {group.coursePrice} دج</p>
            <p className="text-sm text-muted-foreground">
              {group.leads.length} قيد محتمل
            </p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">الولاية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الإضافة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {group.leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>{lead.name}</TableCell>

                    <TableCell>
                      <a
                        href={`tel:${lead.phone}`}
                        className="font-mono hover:underline text-right"
                        dir="ltr"
                      >
                        {lead.phone}
                      </a>
                    </TableCell>

                    <TableCell>{lead.wilaya}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          lead.status === "new"
                            ? "default"
                            : lead.status === "called"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {lead.status === "new"
                          ? "جديد"
                          : lead.status === "called"
                          ? "تم الاتصال"
                          : "ملغي"}
                      </Badge>
                    </TableCell>

                    <TableCell>{formatDate(lead.createdAt)}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => calledLead(lead)}
                        className="h-8 gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        اتصال
                      </Button>

                      <WhitelistModal
                        programs={programs.filter(
                          (p) => p.course._id === lead.course._id
                        )}
                        isLead
                        onAddForm={confirmLead}
                        onDeleteLead={deleteLead}
                        initialData={lead}
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => canceledLead(lead)}
                        className="h-8 gap-2 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        الغاء
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

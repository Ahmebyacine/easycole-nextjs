"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDate } from "@/utils/formatSafeDate";
import { X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import WhitelistModal from "@/components/employees/whitelist-modal";
import ConfirmTraineeModal from "@/components/employees/confirm-trainee-modal";

export default function WhitelistPage() {
  const router = useRouter();

  const { data: programs } = useFetch("/api/programs/employee");
  const {
    data: bookings,
    setData: setBookings,
    loading,
  } = useFetch("/api/whitelists/employee");

  const addWhiteList = async (data) => {
    try {
      const res = await fetch("/api/whitelists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add whitelist");
      const result = await res.json();
      setBookings((prev) => [...prev, result]);
      toast.success("تم إضافة القيد بنجاح");
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء إضافة القيد");
    }
  };

  const updateWhiteList = async (data) => {
    try {
      const res = await fetch(`/api/whitelists/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update whitelist");
      const result = await res.json();
      setBookings((prev) => prev.map((b) => (b._id === data._id ? result : b)));
      toast.success("تم تحديث القيد بنجاح");
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء تحديث القيد");
    }
  };

  const confirmTrainee = async (data) => {
    try {
      const res = await fetch("/api/trainees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to confirm trainee");
      const result = await res.json();
      toast.success("تم تأكيد القيد وتحويله إلى متدرب بنجاح");
      router.push(
        `/employee/add-trainee?success=true&trainee=${encodeURIComponent(
          JSON.stringify(result)
        )}`
      );
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء تأكيد القيد");
    }
  };

  const deleteBooking = async (id) => {
    try {
      const res = await fetch(`/api/whitelists/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("تم حذف القيد بنجاح");
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء حذف القيد");
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const res = await fetch(`/api/whitelists/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "canceled" } : b
        )
      );
      toast.success("تم إلغاء القيد");
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء إلغاء القيد");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10" dir="rtl">
        <div className="text-center">جاري تحميل ..</div>
      </div>
    );
  }

  //if (error) return <ErrorPage error={error} />;

  // Group bookings by program
  const groupedBookings = bookings?.reduce((acc, booking) => {
    const programId = booking?.program?._id || "no_program";
    if (!acc[programId]) {
      acc[programId] = {
        programName: booking?.program?.course?.name || "بدون برنامج",
        programDate: booking?.program?.start_date || "بدون تاريخ",
        programEndDate: booking?.program?.end_date || "بدون تاريخ",
        programInstitution: booking?.program?.institution?.name || "بدون مؤسسة",
        bookings: [],
      };
    }
    acc[programId].bookings.push(booking);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">قيد التسجيل</h1>
          <p className="text-muted-foreground">إدارة قائمة قيد التسجيل</p>
        </div>
        <WhitelistModal programs={programs} onAddForm={addWhiteList} />
      </div>

      {!loading && bookings?.length === 0 && (
        <div className="text-center text-muted-foreground">
          لا يوجد قيد تسجيلات حالياً.
        </div>
      )}

      {Object.entries(groupedBookings).map(([programId, group]) => (
        <div key={programId} className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {group.programName}
            </h2>
            <h3 className="text-l font-medium text-foreground">
              {formatDate(group.programDate)} -{" "}
              {formatDate(group.programEndDate)} | {group.programInstitution}
            </h3>
            <p className="text-sm text-muted-foreground">
              {group.bookings.length} قيد التسجيل
            </p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">الموظف</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {group.bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {booking.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono" dir="ltr">
                        {booking.phone}
                      </span>
                    </TableCell>
                    <TableCell>{booking.employee.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "new" ? "default" : "destructive"
                        }
                      >
                        {booking.status === "new" ? "جديد" : "ملغي"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {booking.note || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {booking.status === "new" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2"
                          onClick={() => handleCancel(booking._id)}
                        >
                          <X className="h-4 w-4" /> إلغاء
                        </Button>
                      )}

                      <WhitelistModal
                        initialData={booking}
                        programs={programs}
                        onEditForm={updateWhiteList}
                      />

                      <ConfirmTraineeModal
                        initialData={booking}
                        programs={programs}
                        onSubmitForm={confirmTrainee}
                        onDeleteForm={deleteBooking}
                      />
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

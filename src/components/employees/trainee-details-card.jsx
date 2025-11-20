"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { formatDate } from "@/utils/formatSafeDate";
import { formatCurrencyDZD } from "@/utils/formatCurrency";
import { getPaymentMethodLabel } from "@/utils/getPaymentMethodLabel";
import DeleteDialog from "../delete-dialog";
import { toast } from "sonner";

const TraineeDetailsCard = ({ trainee, onEdit, onDelete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/receipt/${trainee._id}`);

      if (!res.ok) {
        toast.error("لم تتم إضافة المتدرب");
        throw new Error("Failed to download");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${trainee?.name || "unkow"}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("لم تتم إضافة المتدرب");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-xl font-bold">{trainee?.name}</h3>
          <p className="text-muted-foreground text-right" dir="ltr">
            {trainee?.phone}
          </p>
          {trainee.email && (
            <p className="text-muted-foreground">{trainee?.email}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "جاري التنزيل..." : "تنزيل الوصل"}
          </Button>
          <DeleteDialog onConfirm={onDelete} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">تفاصيل البرنامج</h4>
          <p className="font-medium">{trainee?.program?.course?.name}</p>

          {trainee?.program?.institution && (
            <p className="text-sm text-muted-foreground">
              {trainee?.program?.institution?.name}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            {formatDate(trainee?.program?.start_date)} -{" "}
            {formatDate(trainee?.program?.end_date)}
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">معلومات الدفع</h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">القسط الأولي</p>
              <p className="font-medium">
                {formatCurrencyDZD(trainee?.inialTranche)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">طريقة الدفع</p>
              <p className="font-medium">
                {getPaymentMethodLabel(trainee?.methodePaiement1)}
              </p>
            </div>

            {trainee?.secondTranche !== undefined && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">القسط الثاني</p>
                  <p className="font-medium">
                    {formatCurrencyDZD(trainee?.secondTranche)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                  <p className="font-medium">
                    {getPaymentMethodLabel(trainee?.methodePaiement2)}
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="text-sm text-muted-foreground">المبلغ المتبقي</p>
              <p className="font-medium">{formatCurrencyDZD(trainee?.rest)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">التخفيض</p>
              <p className="font-medium">
                {formatCurrencyDZD(trainee?.discount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">المبلغ الإجمالي</p>
              <p className="font-medium">
                {formatCurrencyDZD(trainee?.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {trainee.note && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">ملاحظات</h4>
            <p className="text-sm">{trainee?.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraineeDetailsCard;

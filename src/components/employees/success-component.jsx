import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SuccessComponent = ({ onReset, trainee }) => {
  const handleDownload = async () => {
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
    }
  };
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">تم التسجيل بنجاح!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-green-500 text-4xl">✓</div>
        <p className="text-muted-foreground">تم تسجيل المتدرب بنجاح</p>
        <div className="flex flex-col align-center">
          <Button className="mt-4" onClick={handleDownload}>
            تنزيل الوصل
          </Button>
          <Button onClick={onReset} className="mt-4">
            إضافة متدرب آخر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

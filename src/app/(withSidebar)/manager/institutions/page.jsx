"use client";

import { Building2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import InstitutionModal from "@/components/institutions/institution-modal";
import InstitutionCard from "@/components/institutions/institution-card";

export default function InstitutionsPage() {
  const {
    data: institutions,
    setData: setInstitutions,
    loading,
    error,
  } = useFetch("/api/institutions/user");


  const handleUpdateInstitution = async (data) => {
    try {
      const res = await fetch(`/api/institutions/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update institution");

      const updatedInstitution = await res.json();
      setInstitutions((prev) =>
        prev.map((inst) => (inst._id === data._id ? updatedInstitution : inst))
      );
      toast.success("تم تحديث المؤسسة", {
        description: `تم تحديث المؤسسة ${updatedInstitution.name}`,
      });
    } catch (error) {
      toast.error("فشل في تحديث المؤسسة");
      console.log(error);
    }
  };

  //if (error) return <ErrorPage error={error} />;

  return (
    <div className="w-full mx-auto py-8 px-5 md:px-10">
      <div className="flex justify-between items-center mb-6 flex-row">
        <h1 className="md:text-3xl text-xl font-bold text-right">المؤسسات</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">جاري تحميل المؤسسات...</p>
        </div>
      ) : institutions?.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا توجد مؤسسات متاحة</h3>
          <p className="text-muted-foreground">ابدأ بإضافة مؤسسة جديدة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions?.map((institution) => (
            <InstitutionCard
              key={institution._id}
              institution={institution}
              onEdit={handleUpdateInstitution}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Users } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import TrainerCard from "@/components/trainers/trainer-card";
import TrainerModal from "@/components/trainers/trainer-modal";

export default function TrainersPage() {
  const { data: trainers, setData: setTrainers, loading } = useFetch("/api/trainers");

  const handleAddTrainer = async (data) => {
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add trainer");

      const newTrainer = await res.json();
      setTrainers((prev) => [newTrainer, ...prev]);
      toast.success("تمت إضافة المدرب");
    } catch {
      toast.error("فشل في إضافة المدرب");
    }
  };

  const handleUpdateTrainer = async (data) => {
    try {
      const res = await fetch(`/api/trainers/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update trainer");

      const updatedTrainer = await res.json();
      setTrainers((prev) =>
        prev.map((t) => (t._id === data._id ? updatedTrainer : t))
      );
      toast.success("تم تحديث المدرب");
    } catch {
      toast.error("فشل في تحديث المدرب");
    }
  };

  const handleDeleteTrainer = async (id) => {
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trainer");

      setTrainers((prev) => prev.filter((t) => t._id !== id));
      toast.success("تم حذف المدرب");
    } catch {
      toast.error("فشل في حذف المدرب");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-row-reverse">
        <TrainerModal onSubmit={handleAddTrainer} />
        <h1 className="text-2xl font-bold text-right">المدربون</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">جاري تحميل المدربين...</p>
        </div>
      ) : trainers?.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا يوجد مدربون</h3>
          <p className="text-muted-foreground">ابدأ بإضافة مدرب جديد</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              onEdit={handleUpdateTrainer}
              onDeleteTrainer={handleDeleteTrainer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

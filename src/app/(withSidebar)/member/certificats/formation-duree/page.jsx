"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TrainingInfoForm from "@/components/certificats/training-info-form";
import TraineeForm from "@/components/certificats/trainee-form";
import TraineesTable from "@/components/certificats/trainees-table";

export default function AttestationDeFormationDureePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trainingDate: undefined,
      initialCertificateNumber: 1,
      certificateNumber: "",
      specialty: "",
      trainees: [],
    },
  });

  const [currentTrainee, setCurrentTrainee] = useState({
    fullName: "",
    birthDate: "",
    birthPlace: "",
    wilaya: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "trainees",
  });

  const handleSaveTrainee = () => {
    if (!currentTrainee.fullName) return;

    if (editingIndex !== null) {
      update(editingIndex, currentTrainee);
      setEditingIndex(null);
    } else {
      append({ ...currentTrainee, id: Date.now().toString() });
    }

    setCurrentTrainee({
      fullName: "",
      birthDate: undefined,
      birthPlace: "",
      wilaya: "",
    });
  };

  const handleEditTrainee = (index) => {
    const trainee = fields[index];
    setCurrentTrainee(trainee);
    setEditingIndex(index);
  };

  async function handleGeneratePDF(values) {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/certificats/attestation-formation-duree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attestations-formation-1-ans.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("تم إنشاء ملف PDF بنجاح!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل إنشاء PDF");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        استخراج شهادة التدريب (سنة واحدة)
      </h1>
      <h1 className="text-xl font-semibold mb-6">
        Attestation de formation (avec durée)
      </h1>

      <form onSubmit={handleSubmit(handleGeneratePDF)}>
        <div className="bg-background p-6 rounded-lg shadow-md mb-6">
          <TrainingInfoForm
            control={control}
            register={register}
            errors={errors}
          />

          <TraineeForm
            currentTrainee={currentTrainee}
            setCurrentTrainee={setCurrentTrainee}
            errors={errors}
            editingIndex={editingIndex}
            handleSaveTrainee={handleSaveTrainee}
          />

          <TraineesTable
            fields={fields}
            handleEditTrainee={handleEditTrainee}
            handleDeleteTrainee={remove}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="px-8"
            disabled={
              !watch("trainingDate") ||
              !watch("certificateNumber") ||
              fields.length === 0 ||
              isDownloading
            }
          >
            {isDownloading ? "جاري التنزيل..." : "استخراج الشهادات PDF"}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function TraineeForm({
  currentTrainee,
  setCurrentTrainee,
  errors,
  editingIndex,
  handleSaveTrainee,
}) {
  const handleInputChange = (e) => {
    setCurrentTrainee({
      ...currentTrainee,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
        {editingIndex !== null ? "تعديل متدرب" : "إضافة متدرب"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم الكامل</Label>

          <Input
            id="fullName"
            name="fullName"
            value={currentTrainee.fullName || ""}
            onChange={handleInputChange}
            placeholder="أدخل الاسم الكامل"
            dir="ltr"
          />

          {errors?.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label>تاريخ الميلاد</Label>

          <Input
            type="text"
            id="birthDate"
            name="birthDate"
            value={currentTrainee.birthDate || ""}
            onChange={handleInputChange}
            placeholder="12/03/2003"
            dir="ltr"
          />
        </div>

        {/* Birth Place */}
        <div className="space-y-2">
          <Label htmlFor="birthPlace">مكان الميلاد</Label>

          <Input
            id="birthPlace"
            name="birthPlace"
            value={currentTrainee.birthPlace || ""}
            onChange={handleInputChange}
            placeholder="أدخل مكان الميلاد"
            dir="ltr"
          />
        </div>

        {/* Wilaya */}
        <div className="space-y-2">
          <Label htmlFor="wilaya">الولاية</Label>

          <Input
            id="wilaya"
            name="wilaya"
            value={currentTrainee.wilaya || ""}
            onChange={handleInputChange}
            placeholder="أدخل الولاية"
            dir="ltr"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-end mt-5 md:w-[30%] w-full">
        <Button
          type="button"
          onClick={handleSaveTrainee}
          className="w-full"
          disabled={!currentTrainee.fullName}
        >
          {editingIndex !== null ? (
            "تحديث المتدرب"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> إضافة متدرب
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

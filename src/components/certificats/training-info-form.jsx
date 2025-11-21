"use client";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { arDZ } from "date-fns/locale";
import { formatDate } from "@/utils/formatSafeDate";

export default function TrainingInfoForm({ control, register, errors }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
        معلومات التدريب
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Training Date */}
        <div className="space-y-2">
          <Label>تاريخ التدريب</Label>

          <Controller
            name="trainingDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? formatDate(field.value)
                      : "اختر تاريخًا"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={arDZ}
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        {/* Initial Certificate Number */}
        <div className="space-y-2">
          <Label htmlFor="initialCertificateNumber">رقم الشهادة الأولى</Label>

          <Input
            type="number"
            id="initialCertificateNumber"
            {...register("initialCertificateNumber", {
              required: "الرقم الأولي مطلوب",
              min: {
                value: 1,
                message: "يجب أن يكون الرقم على الأقل 1",
              },
            })}
            placeholder="أدخل الرقم الأولي"
            dir="ltr"
          />

          {errors.initialCertificateNumber && (
            <p className="text-sm text-red-500">
              {errors.initialCertificateNumber.message}
            </p>
          )}
        </div>

        {/* Certificate Number */}
        <div className="space-y-2">
          <Label htmlFor="certificateNumber">رقم الشهادة (reference)</Label>

          <Input
            id="certificateNumber"
            {...register("certificateNumber", {
              required: "رقم الشهادة مطلوب",
            })}
            placeholder="أدخل رقم الشهادة"
            dir="ltr"
          />

          {errors.certificateNumber && (
            <p className="text-sm text-red-500">
              {errors.certificateNumber.message}
            </p>
          )}
        </div>

        {/* Specialty */}
        <div className="space-y-2">
          <Label htmlFor="specialty">التخصص</Label>

          <Input
            id="specialty"
            {...register("specialty", {
              required: "التخصص مطلوب",
            })}
            placeholder="أدخل التخصص"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}

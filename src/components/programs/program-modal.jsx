"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ validation schema
const programSchema = z.object({
  course: z.string({ required_error: "الدورة مطلوبة" }),
  institution: z.string({ required_error: "المؤسسة مطلوبة" }),
  trainer: z.string({ required_error: "المدرب مطلوب" }),
  start_date: z.string({ required_error: "تاريخ البدء مطلوب" }),
  end_date: z.string({ required_error: "تاريخ الانتهاء مطلوب" }),
});

export default function ProgramModal({
  courses = [],
  institutions = [],
  trainers = [],
  onSubmit,
  onUpdate,
  mode = "add",
  initialData = null,
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: {
      course: "",
      institution: "",
      trainer: "",
      start_date: "",
      end_date: "",
    },
  });

  // format for input type="date"
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Reset when editing/adding
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        course: initialData.course?._id,
        institution: initialData.institution?._id,
        trainer: initialData.trainer?._id,
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
      });
    } else {
      form.reset({
        course: "",
        institution: "",
        trainer: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [mode, initialData, form]);

  const handleFormSubmit = async (data) => {
    if (mode === "edit") {
      await onUpdate({ ...initialData, ...data });
    } else {
      await onSubmit(data);
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            إضافة برنامج
          </Button>
        ) : (
          <Button variant="outline">تعديل</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "إضافة برنامج جديد" : "تعديل البرنامج"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "قم بملء التفاصيل لإضافة برنامج جديد."
              : "قم بتحديث تفاصيل البرنامج."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدورة *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدورة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤسسة *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المؤسسة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {institutions?.map((i) => (
                        <SelectItem key={i._id} value={i._id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدرب *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدرب" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainers?.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البدء *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ النهاية *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4 mr-1" /> إلغاء
              </Button>
              <Button type="submit">
                {mode === "add" ? "إضافة برنامج" : "تحديث البرنامج"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const courseSchema = z.object({
  name: z.string().min(2, "يجب أن يتكون الاسم من حرفين على الأقل"),
  price: z.coerce.number().min(0, "السعر يجب أن يكون رقمًا موجبًا"),
  duree: z.string().optional(),
});

export default function CourseModal({ onSubmit, course }) {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: course || { name: "", price: 0, duree: "" },
  });

  useEffect(() => {
    form.reset(course || { name: "", price: 0, duree: "" });
  }, [course, form]);

  const handleSubmit = (data) => {
    if (course?._id) onSubmit({ ...data, _id: course._id });
    else onSubmit(data);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {course ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            تعديل
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة دورة
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {course ? "تعديل الدورة" : "إضافة دورة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {course
              ? "قم بتحديث تفاصيل الدورة."
              : "املأ البيانات لإضافة دورة جديدة."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الدورة</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم الدورة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: 3 أشهر" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit">
                <Check className="h-4 w-4 mr-1" />
                {course ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

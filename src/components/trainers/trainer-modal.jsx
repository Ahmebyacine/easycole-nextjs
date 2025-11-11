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

const trainerSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
  email: z.string().email({ message: "بريد إلكتروني غير صالح" }),
  phone: z.string().min(8, { message: "يجب أن يتكون الرقم من 8 أرقام على الأقل" }),
});

export default function TrainerModal({ onSubmit, trainer }) {
  const form = useForm({
    resolver: zodResolver(trainerSchema),
    defaultValues: trainer || { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    form.reset(trainer || { name: "", email: "", phone: "" });
  }, [trainer, form]);

  const handleSubmit = (data) => {
    if (trainer?._id) onSubmit({ ...data, _id: trainer._id });
    else onSubmit(data);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trainer ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            تعديل
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مدرب
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trainer ? "تعديل المدرب" : "إضافة مدرب جديد"}</DialogTitle>
          <DialogDescription>
            {trainer
              ? "قم بتحديث بيانات المدرب."
              : "املأ المعلومات لإضافة مدرب جديد."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المدرب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="05xxxxxxxx" {...field} />
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
                {trainer ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

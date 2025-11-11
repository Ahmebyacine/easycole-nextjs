"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const institutionSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export default function InstitutionModal({
  onSubmit,
  editingInstitution = null,
}) {
  const form = useForm({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (editingInstitution) {
      form.reset({
        name: editingInstitution.name || "",
        address: editingInstitution.address || "",
        phone: editingInstitution.phone || "",
      });
    } else {
      form.reset({
        name: "",
        address: "",
        phone: "",
      });
    }
  }, [editingInstitution, form]);

  const handleSubmit = (data) => {
    const payload = editingInstitution
      ? { ...editingInstitution, ...data }
      : data;
    onSubmit(payload);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {editingInstitution ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            تعديل
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مؤسسة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingInstitution ? "تعديل المؤسسة" : "إضافة مؤسسة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {editingInstitution
              ? "قم بتعديل تفاصيل المؤسسة أدناه."
              : "قم بملء التفاصيل لإضافة مؤسسة جديدة."}
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
                  <FormLabel>الاسم *</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المؤسسة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان المؤسسة" {...field} />
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
                  <FormLabel>الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="ml-2">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingInstitution ? "حفظ التغييرات" : "إضافة مؤسسة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

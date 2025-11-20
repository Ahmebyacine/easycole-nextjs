"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  DialogClose,
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatSafeDate";

const confirmTraineeSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
  email: z.string().email().optional(),
  phone: z.string().min(10, "يرجى إدخال رقم هاتف صحيح"),
  program: z.string({ required_error: "الرجاء اختيار البرنامج" }),
  inialTranche: z.coerce.number().min(0).optional(),
  secondTranche: z.coerce.number().min(0).optional(),
  methodePaiement1: z.string().optional(),
  discount: z.coerce.number().min(0).optional(),
  rest: z.coerce.number().min(0).optional(),
  totalPrice: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
});

export default function ConfirmTraineeModal({
  programs,
  onSubmitForm,
  onDeleteForm,
  initialData,
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(confirmTraineeSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      program: initialData?.program?._id || "",
      inialTranche: 0,
      secondTranche: 0,
      methodePaiement1: "cash",
      discount: 0,
      rest: 0,
      totalPrice: 0,
      note: initialData?.note || "",
    },
  });

  const programId = form.watch("program");
  const discount = form.watch("discount");

  useEffect(() => {
    const selectedProgram = programs.find((p) => p._id === programId);

    if (selectedProgram) {
      const basePrice = selectedProgram.course.price;
      const finalPrice = basePrice - (discount || 0);

      form.setValue("totalPrice", finalPrice);
      form.setValue("rest", finalPrice);
      form.setValue("secondTranche", 0);
    }
  }, [programId, discount, programs, form]);

  const handleSubmit = async (data) => {
    await onSubmitForm(data);
    await onDeleteForm(initialData?._id);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">تأكيد المتدرب</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تأكيد تسجيل المتدرب</DialogTitle>
          <DialogDescription>
            يرجى ملء النموذج أدناه لتأكيد تسجيل المتدرب.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* الاسم */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم *</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* الهاتف */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف *</FormLabel>
                  <FormControl>
                    <Input placeholder="05xxxxxxxx" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* البريد الإلكتروني */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" dir="ltr" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* البرنامج */}
            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البرنامج *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر برنامجًا" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program._id} value={program._id}>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">
                              {program.course.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {program.institution?.name} •{" "}
                              {formatDate(program.start_date)} -{" "}
                              {formatDate(program.end_date)} •{" "}
                              {program.trainer?.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Payment Information */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">معلومات الدفع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Tranche */}
                <FormField
                  control={form.control}
                  name="inialTranche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>القسط الأولي</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Price */}
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>المبلغ الإجمالي</FormLabel>
                      <FormControl>
                        <Input type="number" readOnly disabled {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="methodePaiement1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>طريقة الدفع</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر طريقة الدفع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">نقدي</SelectItem>
                            <SelectItem value="baridimob">بريدي موب</SelectItem>
                            <SelectItem value="ccp">تحويل بريدي CCP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الخصم</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-4 overflow-auto"
                        >
                          {[0, 2000, 4000, 5000].map((val) => (
                            <FormItem key={val}>
                              <FormControl>
                                <RadioGroupItem
                                  value={val}
                                  id={`discount-${val}`}
                                  className="hidden peer"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`discount-${val}`}
                                className={cn(
                                  "cursor-pointer rounded-xl border px-6 py-3",
                                  field.value == val
                                    ? "bg-primary/20 border-primary"
                                    : "hover:border-primary/50"
                                )}
                              >
                                {val} دج
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أضف أي ملاحظات إضافية هنا" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button type="submit" className="flex-1">حفظ</Button>
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">إلغاء</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
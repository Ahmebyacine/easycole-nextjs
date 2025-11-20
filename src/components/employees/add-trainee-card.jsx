"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatSafeDate";

const formSchema = z.object({
  name: z.string().min(2, "يجب أن يتكون الاسم من حرفين على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صالح").optional(),
  phone: z.string().min(10, "يرجى إدخال رقم هاتف صحيح"),
  program: z.string({ required_error: "الرجاء اختيار البرنامج" }),
  inialTranche: z.coerce.number().min(0).optional(),
  secondTranche: z.coerce.number().min(0).optional(),
  methodePaiement1: z.string().optional(),
  discount: z.coerce.number().min(0).optional(),
  totalPrice: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
});

export const AddTraineeCard = ({ programs, onSubmit, isLoading }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
      inialTranche: 0,
      secondTranche: 0,
      methodePaiement1: "cash",
      discount: 0,
      totalPrice: 0,
      note: "",
    },
  });

  useEffect(() => {
    const selectedDiscount = form.watch("discount");
    const selectedProgramId = form.watch("program");
    const selectedProgram = programs?.find((p) => p._id === selectedProgramId);
    if (selectedProgram) {
      form.setValue(
        "totalPrice",
        selectedProgram.course.price - (selectedDiscount || 0)
      );
    }
  }, [form.watch("program"), form.watch("discount"), programs]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          تسجيل متدرب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم الكامل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الهاتف *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="أدخل رقم الهاتف"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="اختياري" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
              {/* Program */}
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البرنامج *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر برنامجًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programs?.map((program) => (
                          <SelectItem
                            key={program._id}
                            value={program._id}
                            className="py-3"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {program.course.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center">
                                <span>{program.institution?.name}</span>
                                <span className="hidden sm:inline-block sm:mx-1">
                                  •
                                </span>
                                <span>
                                  {formatDate(program.start_date)} -{" "}
                                  {formatDate(program.end_date)}
                                </span>
                                <span className="hidden sm:inline-block sm:mx-1">
                                  •
                                </span>
                                <span>{program.trainer?.name}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">معلومات الدفع</h3>
              {/* Total Price Field */}
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>المبلغ الإجمالي</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        readOnly
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <FormField
                control={form.control}
                name="methodePaiement1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>طريقة الدفع</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="baridimob">بريدي موب</SelectItem>
                          <SelectItem value="ccp">CCP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-3 flex-wrap"
                      >
                        {[0, 2000, 4000, 5000].map((val) => (
                          <FormItem key={val}>
                            <RadioGroupItem
                              value={val}
                              id={`discount-${val}`}
                              className="hidden peer"
                            />
                            <FormLabel
                              htmlFor={`discount-${val}`}
                              className={cn(
                                "cursor-pointer rounded-lg border px-5 py-2",
                                "hover:border-primary",
                                field.value == val
                                  ? "bg-primary/20 border-primary"
                                  : ""
                              )}
                            >
                              {val} دج
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أضف أي ملاحظات إضافية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري الإرسال..." : "تسجيل المتدرب"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

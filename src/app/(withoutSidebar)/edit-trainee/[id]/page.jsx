"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowRight } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatSafeDate";
import useFetch from "@/hooks/use-fetch";

// Trainee form schema
const traineeSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
  email: z
    .string()
    .email({ message: "يرجى إدخال بريد إلكتروني صالح" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(10, { message: "يرجى إدخال رقم هاتف صحيح" }),
  program: z.string({ required_error: "الرجاء اختيار البرنامج" }),
  inialTranche: z.coerce.number().min(0),
  secondTranche: z.coerce.number().min(0).optional(),
  methodePaiement1: z.string().optional().or(z.literal("")),
  methodePaiement2: z.string().optional().or(z.literal("")),
  discount: z.coerce.number().min(0).optional(),
  rest: z.coerce.number().min(0),
  totalPrice: z.coerce.number().min(0),
  note: z.string().optional().or(z.literal("")),
});

export default function EditTraineePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(traineeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
      inialTranche: 0,
      secondTranche: 0,
      rest: 0,
      totalPrice: 0,
      note: "",
    },
  });
  const { data: programs } = useFetch("/api/programs/employee");
  // Fetch trainee and programs
  useEffect(() => {
    const fetchTrainee = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/trainees/${id}`);
        const data = await res.json();

        form.reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          program: data.program._id,
          inialTranche: data.inialTranche,
          secondTranche: data.secondTranche,
          methodePaiement1: data.methodePaiement1 || "cash",
          methodePaiement2: data.methodePaiement2 || "cash",
          discount: data.discount || 0,
          rest: data.rest,
          totalPrice: data.totalPrice,
          note: data.note,
        });
      } catch (err) {
        toast.error("Error fetching trainee");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, form]);

  // Auto-update rest field
  useEffect(() => {
    const totalPrice = Number(form.watch("totalPrice")) || 0;
    const secondTranche = Number(form.watch("secondTranche")) || 0;
    const inialTranche = Number(form.watch("inialTranche")) || 0;

    form.setValue("rest", totalPrice - (secondTranche + inialTranche));
  }, [
    form.setValue,
    form.watch("totalPrice"),
    form.watch("secondTranche"),
    form.watch("inialTranche"),
  ]);

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      await fetch(`/api/trainees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      toast.success("تم تحديث معلومات المتدرب بنجاح");
      setTimeout(() => router.push("/employee/search"), 1000);
    } catch (err) {
      toast.error("لم يتم تحديث المتدرب");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => router.push("/employee/search")}
      >
        <ArrowRight className="h-4 w-4 mr-2" /> العودة إلى البحث
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            تعديل بيانات متدرب
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
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
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="أدخل عنوان البريد الإلكتروني"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الهاتف *</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم الهاتف" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <br />
                  {/* Program Field */}
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البرنامج *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedProgram = programs?.find(
                              (program) => program._id === value
                            );
                            if (selectedProgram) {
                              form.setValue(
                                "totalPrice",
                                selectedProgram.course.price
                              );
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  programs?.length === 0
                                    ? "جاري تحميل البرامج..."
                                    : "اختر برنامجًا"
                                }
                              />
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
                {/* Payment Information */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">معلومات الدفع</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Initial Tranche Field */}
                    <FormField
                      control={form.control}
                      name="inialTranche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>القسط الأولي</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/*methode paiement 1 */}
                    <FormField
                      control={form.control}
                      name="methodePaiement1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الدفع (القسط الأول)</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر طريقة الدفع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">نقدًا</SelectItem>
                                <SelectItem value="ccp">تحويل بريدي</SelectItem>
                                <SelectItem value="baridimob">
                                  بريدي موب
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Second Tranche Field */}
                    <FormField
                      control={form.control}
                      name="secondTranche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>القسط الثاني</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/*methode paiement 2 */}
                    <FormField
                      control={form.control}
                      name="methodePaiement2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الدفع (القسط الثاني)</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر طريقة الدفع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">نقدًا</SelectItem>
                                <SelectItem value="ccp">تحويل بريدي</SelectItem>
                                <SelectItem value="baridimob">
                                  بريدي موب
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Rest Field */}
                    <FormField
                      control={form.control}
                      name="rest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المتبقي</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              readOnly
                              disabled={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                </div>
                {/* Note Field */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ملاحظات</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أضف أي ملاحظات إضافية هنا"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSaving || !form.formState.isDirty}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => router.push("/trainee/search")}
          >
            إلغاء
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

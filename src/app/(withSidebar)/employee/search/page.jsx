"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { QrCode, Search, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QRScanner from "@/components/employees/QR-scanner";
import { useIsMobile } from "@/hooks/use-mobile";
import TraineeDetailsCard from "@/components/employees/trainee-details-card";

const searchSchema = z.object({
  searchTerm: z.string().min(8, { message: "الرجاء إدخال معرف أو رقم هاتف" }),
});

export default function TraineeSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [trainee, setTrainee] = useState(null);
  const isMobile = useIsMobile();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTrainee = async (searchTerm) => {
    setIsSearching(true);
    setTrainee(null);

    try {
      const res = await fetch("/api/trainees/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: searchTerm }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "حدث خطأ");
      }

      const data = await res.json();
      setTrainee(data);

      toast.success("تم العثور على المتدرب", {
        description: `لقد وجد المتدرب ${data.name}`,
      });
    } catch (error) {
      toast.error("لم يتم العثور على المتدرب", {
        description: error.message,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = (values) => {
    searchTrainee(values.searchTerm);
  };

  const handleQRScan = (value) => {
    form.setValue("searchTerm", value);
    searchTrainee(value);
  };

  const handleEdit = () => {
    if (!trainee) return;
    router.push(`/edit-trainee/${trainee._id}`);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/trainees/${trainee._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setTrainee(null);
      toast.success("تم الحذف بنجاح");
    } catch {
      toast.error("فشل في الحذف");
    }
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-right">
            بحث عن متدرب
          </CardTitle>
          <CardDescription className="text-right">
            ابحث عن متدرب باستخدام الرقم التعريفي أو رقم الهاتف
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isMobile ? (
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">
                  <Search className="h-4 w-4 ml-2" />
                  بحث
                </TabsTrigger>
                <TabsTrigger value="qr">
                  <QrCode className="h-4 w-4 ml-2" />
                  مسح رمز
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="mt-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="searchTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">
                            الرقم التعريفي أو رقم الهاتف
                          </FormLabel>

                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="أدخل الرقم التعريفي أو رقم الهاتف للمتدرب"
                                {...field}
                              />
                            </FormControl>

                            <Button type="submit" disabled={isSearching}>
                              {isSearching ? (
                                <>
                                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                  جاري البحث
                                </>
                              ) : (
                                <>
                                  <Search className="h-4 w-4 ml-2" />
                                  بحث
                                </>
                              )}
                            </Button>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="qr" className="mt-4">
                {!trainee && <QRScanner onScan={handleQRScan} />}
              </TabsContent>
            </Tabs>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">
                        الرقم التعريفي أو رقم الهاتف
                      </FormLabel>

                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="أدخل الرقم التعريفي أو رقم الهاتف للمتدرب"
                            {...field}
                          />
                        </FormControl>

                        <Button type="submit" disabled={isSearching}>
                          {isSearching ? (
                            <>
                              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                              جاري البحث
                            </>
                          ) : (
                            <>
                              <Search className="h-4 w-4 ml-2" />
                              بحث
                            </>
                          )}
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {trainee && (
            <div className="mt-8 border-t pt-6">
              <TraineeDetailsCard
                trainee={trainee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            هل تحتاج إلى تسجيل متدرب جديد؟
          </p>

          <Button
            variant="outline"
            onClick={() => router.push("/employee/add-trainee")}
          >
            إضافة متدرب جديد
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

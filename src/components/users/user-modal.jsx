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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";

const userSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().optional(),
  phone: z.string().min(8, "الرقم قصير جدًا"),
  nationalId: z.string().min(1, "الرقم الوطني مطلوب"),
  role: z.enum(["employee", "manager", "member"]),
  institutions: z.array(z.string()).optional(),
});

export default function UserModal({
  onSubmit,
  editingUser,
  institutions = [],
}) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      nationalId: "",
      role: "employee",
      institutions: [],
    },
  });

  useEffect(() => {
    if (editingUser) {
      form.reset({
        ...editingUser,
        password: "",
        institutions: editingUser.institutions.map((inst) => inst._id),
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        phone: "",
        nationalId: "",
        role: "employee",
        institutions: [],
      });
    }
  }, [editingUser, form]);

  const handleSubmit = (data) => {
    const payload = editingUser ? { ...editingUser, ...data } : data;
    onSubmit(payload);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {editingUser ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            تعديل
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مستخدم
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "قم بتعديل تفاصيل المستخدم أدناه."
              : "قم بملء التفاصيل لإضافة مستخدم جديد."}
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
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المستخدم" {...field} />
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
                    <Input
                      type="email"
                      dir="ltr"
                      placeholder="example@mail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    كلمة المرور
                    {editingUser && (
                      <span className="text-muted-foreground">
                        (اتركها فارغة للحفاظ على الحالية)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم الوطني</FormLabel>
                  <FormControl>
                    <Input placeholder="الرقم الوطني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">موظف</SelectItem>
                      <SelectItem value="manager">مدير</SelectItem>
                      <SelectItem value="member">عضو</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤسسات</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-2">
                      <ScrollArea className="h-15">
                        <div className="space-y-2">
                          {institutions?.map((institution) => (
                            <div
                              key={institution._id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`add-inst-${institution._id}`}
                                checked={field.value.includes(institution._id)}
                                onChange={() => {
                                  const newValue = field.value.includes(
                                    institution._id
                                  )
                                    ? field.value.filter(
                                        (id) => id !== institution._id
                                      )
                                    : [...field.value, institution._id];
                                  field.onChange(newValue);
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor={`add-inst-${institution._id}`}
                                className="text-sm"
                              >
                                {institution.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
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
                {editingUser ? "حفظ التغييرات" : "إضافة مستخدم"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { toast } from "sonner";
import { UserCircle } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import UserModal from "@/components/users/user-modal";
import UserCard from "@/components/users/user-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UsersPage() {
  const {
    data: users,
    setData: setUsers,
    loading: isLoading,
    error,
  } = useFetch("/api/users");
  const { data: institutions } = useFetch("/api/institutions");

  const handleAddUser = async (data) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add user");

      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      toast.success("تمت إضافة المستخدم", {
        description: `تمت إضافة ${newUser.name}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل في إضافة المستخدم");
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      const res = await fetch(`/api/users/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === data._id ? updatedUser : u))
      );
      toast.success("تم تحديث المستخدم", {
        description: `تم تحديث ${updatedUser.name}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل في تحديث المستخدم");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("تم حذف المستخدم");
    } catch (error) {
      console.error(error);
      toast.error("فشل في حذف المستخدم");
    }
  };

  //if (error) return <ErrorPage error={error} />;
  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-row-reverse">
        <UserModal institutions={institutions} onSubmit={handleAddUser} />
        <h1 className="md:text-3xl text-xl font-bold text-right">المستخدمون</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">جاري تحميل المستخدمين...</p>
        </div>
      ) : users?.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا يوجد مستخدمون</h3>
          <p className="text-muted-foreground">ابدأ بإضافة مستخدم جديد</p>
        </div>
      ) : (
        <Tabs defaultValue="employee" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employee">الموظفين</TabsTrigger>
            <TabsTrigger value="member">الأعضاء</TabsTrigger>
            <TabsTrigger value="manager">المدراء</TabsTrigger>
          </TabsList>

          <TabsContent value="employee">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users
                .filter((user) => user.role === "employee")
                .map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    institutions={institutions}
                    onEdit={handleUpdateUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
            </div>
            {users.filter((user) => user.role === "employee").length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">لا يوجد مستخدمون</h3>
                <p className="text-muted-foreground">ابدأ بإضافة مستخدم جديد</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manager">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users
                .filter((user) => user.role === "manager")
                .map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    institutions={institutions}
                    onEdit={handleUpdateUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
            </div>
            {users.filter((user) => user.role === "manager").length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">لا يوجد مستخدمون</h3>
                <p className="text-muted-foreground">ابدأ بإضافة مستخدم جديد</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="member">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users
                .filter((user) => user.role === "member")
                .map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    institutions={institutions}
                    onEdit={handleUpdateUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
            </div>
            {users.filter((user) => user.role === "member").length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">لا يوجد مستخدمون</h3>
                <p className="text-muted-foreground">ابدأ بإضافة مستخدم جديد</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

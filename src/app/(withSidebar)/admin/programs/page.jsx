"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import ProgramCard from "@/components/programs/program-card";
import ProgramModal from "@/components/programs/program-modal";

export default function Programs() {
  const {
    data: programs,
    setData: setPrograms,
    loading: isLoading,
    error,
  } = useFetch("/api/programs");
  const { data: courses } = useFetch("/api/courses");
  const { data: institutions } = useFetch("/api/institutions");
  const { data: trainers } = useFetch("/api/trainers");

  const [selectedTab, setSelectedTab] = useState("upcoming");

  const { inProgress, upcoming, completed } = useMemo(() => {
    const now = new Date();
    return {
      inProgress: programs?.filter(
        (p) => new Date(p.start_date) <= now && new Date(p.end_date) >= now
      ),
      upcoming: programs?.filter((p) => new Date(p.start_date) > now),
      completed: programs?.filter((p) => new Date(p.end_date) < now),
    };
  }, [programs]);

  const handleAddProgram = async (data) => {
    try {
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to add program");

      const newProgram = await res.json();
      setPrograms((prev) => [...prev, newProgram]);
      toast.success("تمت إضافة البرنامج", {
        description: `تمت إضافة البرنامج ${newProgram.course?.name || ""}`,
      });
    } catch (error) {
      toast.error("لم يتم إضافة البرنامج");
    }
  };

  const handleUpdateProgram = async (data) => {
    try {
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      const res = await fetch(`/api/programs/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to update program");

      const updatedProgram = await res.json();
      setPrograms((prev) =>
        prev.map((p) => (p._id === data._id ? updatedProgram : p))
      );
      setEditingId(null);
      toast.success("تم تحديث البرنامج", {
        description: `تم تحديث البرنامج ${updatedProgram.course?.name || ""}`,
      });
    } catch (error) {
      toast.error("لم يتم تحديث البرنامج");
      setEditingId(null);
    }
  };

  const handleDeleteProgram = async (id) => {
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete program");

      setPrograms((prev) => prev.filter((p) => p._id !== id));
      toast.success("تم حذف البرنامج");
    } catch (error) {
      toast.error("لم يتم حذف البرنامج");
    }
  };

  const renderContent = (items, emptyMessage) => {
    if (!items?.length) {
      return (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{emptyMessage}</h3>
          <p className="text-muted-foreground">لا توجد برامج في هذا القسم</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {items.map((program) => (
          <ProgramCard
            key={program._id}
            program={program}
            courses={courses}
            institutions={institutions}
            trainers={trainers}
            onDeleteProgram={handleDeleteProgram}
            onUpdateProgram={handleUpdateProgram}
          />
        ))}
      </div>
    );
  };

  //if (error) return <ErrorPage error={error} />;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6 flex-row-reverse">
        <ProgramModal
          courses={courses}
          institutions={institutions}
          trainers={trainers}
          onSubmit={handleAddProgram}
        />
        <h1 className="text-xl md:text-3xl font-bold text-right">
          البرامج التدريبية
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">جاري تحميل البرامج...</p>
        </div>
      ) : programs?.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا توجد برامج متاحة</h3>
          <p className="text-muted-foreground">ابدأ بإضافة برنامج جديد</p>
        </div>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} dir="rtl">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">البرامج القادمة</TabsTrigger>
            <TabsTrigger value="inprogress">البرامج الجارية</TabsTrigger>
            <TabsTrigger value="completed">البرامج المكتملة</TabsTrigger>
          </TabsList>

          <TabsContent value="inprogress">
            {renderContent(inProgress, "لا توجد برامج جارية")}
          </TabsContent>
          <TabsContent value="upcoming">
            {renderContent(upcoming, "لا توجد برامج قادمة")}
          </TabsContent>
          <TabsContent value="completed">
            {renderContent(completed, "لا توجد برامج مكتملة")}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

"use client";

import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import CourseCard from "@/components/courses/course-card";
import CourseModal from "@/components/courses/course-modal";

export default function CoursesPage() {
  const {
    data: courses,
    setData: setCourses,
    loading,
  } = useFetch("/api/courses");

  const handleAddCourse = async (data) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add course");

      const newCourse = await res.json();
      setCourses((prev) => [...prev, newCourse]);
      toast.success("تمت إضافة الدورة");
    } catch (error) {
      toast.error("فشل في إضافة الدورة");
    }
  };

  const handleUpdateCourse = async (data) => {
    try {
      const res = await fetch(`/api/courses/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update course");

      const updatedCourse = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c._id === data._id ? updatedCourse : c))
      );
      toast.success("تم تحديث الدورة");
    } catch (error) {
      toast.error("فشل في تحديث الدورة");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete course");

      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("تم حذف الدورة");
    } catch (error) {
      toast.error("فشل في حذف الدورة");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-row-reverse">
        <CourseModal onSubmit={handleAddCourse} />
        <h1 className="text-2xl font-bold text-right">الدورات التدريبية</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">جاري تحميل الدورات...</p>
        </div>
      ) : courses?.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">لا توجد دورات متاحة</h3>
          <p className="text-muted-foreground">ابدأ بإضافة دورة جديدة</p>
        </div>
      ) : (
        <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

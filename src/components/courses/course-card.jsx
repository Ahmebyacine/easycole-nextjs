"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "../delete-dialog";
import { formatCurrencyDZD } from "@/utils/formatCurrency";
import CourseModal from "./course-modal";

export default function CourseCard({ course, onEdit, onDeleteCourse }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle>{course.name}</CardTitle>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">
          {formatCurrencyDZD(course.price)}
        </span>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          {course.duree || "المدة غير محددة"}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-end gap-2">
        <CourseModal course={course} onSubmit={onEdit} />

        <DeleteDialog onConfirm={() => onDeleteCourse(course._id)} />
      </CardFooter>
    </Card>
  );
}

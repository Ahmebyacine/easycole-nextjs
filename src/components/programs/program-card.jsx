"use client";

import { useState } from "react";
import {
  Pencil,
  Calendar,
  Users,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { calculateDuration, formatDate } from "@/utils/formatSafeDate";
import DeleteDialog from "../delete-dialog";
import ProgramModal from "./program-modal";

export default function ProgramCard({
  program,
  courses,
  institutions,
  trainers,
  onUpdateProgram,
  onDeleteProgram,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false);

  // Get program status based on dates
  const getProgramStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { label: "قادم", color: "bg-blue-100 text-blue-800" };
    } else if (now > end) {
      return { label: "اكتملت", color: "bg-green-100 text-green-800" };
    } else {
      return { label: "قيد التقدم", color: "bg-yellow-100 text-yellow-800" };
    }
  };

  const handleToggle = async () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    if (newState) {
      try {
        setIsLoadingTrainees(true);

        const response = await fetch(`/api/trainees/program/${program._id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trainees");
        }

        const data = await response.json();
        setTrainees(data);
      } catch (error) {
        toast.error("خطأ في جلب المتدربين");
      } finally {
        setIsLoadingTrainees(false);
      }
    }
  };

  const status = getProgramStatus(program.start_date, program.end_date);

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={handleToggle}
      className="border rounded-lg overflow-hidden"
    >
      <Card className="border-0 rounded-none">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>
                  {program.course?.name || "دورة غير معروفة"}
                </CardTitle>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
              <CardDescription className="mt-1">
                في {program.institution?.name || "مؤسسة غير معروفة"}
              </CardDescription>
              <CardDescription className="mt-1">
                {program.trainer?.name || "مدرب غير معروف"}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 w-full sm:w-auto"
                >
                  <Users className="h-4 w-4" />
                  المتدربون
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">المدة</div>
                  <div>
                    {calculateDuration(program.start_date, program.end_date)}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">التواريخ</div>
                  <div>
                    {formatDate(program.start_date)} -{" "}
                    {formatDate(program.end_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-end gap-2 w-full">
            <ProgramModal
              courses={courses}
              institutions={institutions}
              trainers={trainers}
              onUpdate={onUpdateProgram}
              mode="edit"
              initialData={program}
            />
            <DeleteDialog
              title={`هل أنت متأكد من حذف ${program.course?.name}؟`}
              description={`سيتم حذف برنامج ${program.course?.name} في ${program.institution?.name} نهائيًا.`}
              onConfirm={() => onDeleteProgram(program._id)}
            />
          </div>
        </CardFooter>
      </Card>

      <CollapsibleContent>
        <Separator />
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              المتدربون في {program.course?.name}
            </h3>
          </div>

          {isLoadingTrainees ? (
            <div className="flex justify-center items-center h-32">
              <p>جاري تحميل المتدربين...</p>
            </div>
          ) : trainees?.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                لا يوجد متدربون في هذا البرنامج
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المتدرب</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainees?.map((trainee) => (
                    <TableRow key={trainee._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">{trainee?.name}</div>
                      </TableCell>
                      <TableCell>{trainee.email}</TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {trainee.phone}
                      </TableCell>
                      <TableCell>{formatDate(trainee.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

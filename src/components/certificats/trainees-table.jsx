"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TraineesTable({
  fields,
  handleEditTrainee,
  handleDeleteTrainee,
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
        قائمة المتدربين
      </h2>

      {fields.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم الكامل</TableHead>
                <TableHead>تاريخ الميلاد</TableHead>
                <TableHead>مكان الميلاد</TableHead>
                <TableHead>الولاية</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    {field.fullName}
                  </TableCell>

                  <TableCell>
                    {field.birthDate}
                  </TableCell>

                  <TableCell>{field.birthPlace}</TableCell>
                  <TableCell>{field.wilaya}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-start gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        size="icon"
                        onClick={() => handleEditTrainee(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => handleDeleteTrainee(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          لم يتم إضافة متدربين بعد. يرجى إضافة متدربين باستخدام النموذج أعلاه.
        </div>
      )}
    </div>
  );
}

"use client";

import { MapPin, Phone, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteDialog from "../delete-dialog";
import InstitutionModal from "./institution-modal";

export default function InstitutionCard({ institution, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>{institution.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>{institution.address || "لا يوجد عنوان"}</span>
        </div>
        <div className="flex items-start">
          <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>{institution.phone || "لا يوجد هاتف"}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-end gap-2">
        <InstitutionModal onSubmit={onEdit} editingInstitution={institution} />
        {onDelete && (
          <DeleteDialog
            title="هل أنت متأكد؟"
            description={`سيتم حذف المؤسسة ${institution.name} نهائيًا. لا يمكن التراجع عن هذا الإجراء.`}
            onConfirm={() => onDelete(institution._id)}
          />
        )}
      </CardFooter>
    </Card>
  );
}

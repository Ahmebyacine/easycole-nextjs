"use client";

import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "../delete-dialog";
import TrainerModal from "./trainer-modal";

export default function TrainerCard({ trainer, onEdit, onDeleteTrainer }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle>{trainer.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{trainer.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{trainer.phone}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-end gap-2">
        <TrainerModal trainer={trainer} onSubmit={onEdit} />
        <DeleteDialog onConfirm={() => onDeleteTrainer(trainer._id)} />
      </CardFooter>
    </Card>
  );
}

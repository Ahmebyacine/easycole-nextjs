"use client";

import { Mail, Phone, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteDialog from "../delete-dialog";
import UserModal from "./user-modal";

export default function UserCard({ user, institutions, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>{user.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2 space-y-2 text-sm">
        <div className="flex items-center">
          <Mail className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center">
          <User className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>
            {user.role === "manager"
              ? "مدير"
              : user.role === "employee"
              ? "موظف"
              : "عضو"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-end gap-2">
        <UserModal
          editingUser={user}
          institutions={institutions}
          onSubmit={onEdit}
        />
        <DeleteDialog
          title="هل أنت متأكد؟"
          description={`سيتم حذف المستخدم ${user.name} نهائيًا.`}
          onConfirm={() => onDelete(user._id)}
        />
      </CardFooter>
    </Card>
  );
}

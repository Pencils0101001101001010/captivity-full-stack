"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Loader2 } from "lucide-react";

interface TableActionsProps {
  id: string;
  isDeleting: boolean;
  isToggling: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TableActions({
  id,
  isDeleting,
  isToggling,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(id)}
        disabled={isDeleting}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(id)}
        disabled={isDeleting}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
          disabled={isToggling}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

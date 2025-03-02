"use client";

import { TUser } from "../types";
import { UsersCreateDialog } from "./users-create-dialog";
import { UsersEditDialog } from "./users-edit-dialog";

interface Props {
  currentRow?: TUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;

  if (isEdit && currentRow) {
    return (
      <UsersEditDialog
        currentRow={currentRow}
        open={open}
        onOpenChange={onOpenChange}
      />
    );
  }

  return <UsersCreateDialog open={open} onOpenChange={onOpenChange} />;
}

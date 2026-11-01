"use client";

import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { trpc } from "@/lib/trpc/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/features/users/components/confirm-dialog";
import { TUser } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: TUser;
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const utils = trpc.useUtils();

  const deleteUserMutation = trpc.user.deleteUserId.useMutation();
  const onDelete = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId, {
      onSuccess: () => {
        utils.user.getUsers.invalidate();
      },
    });
  };

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return;
    onDelete(currentRow.id);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the user with the role of{" "}
            <span className="font-bold">{currentRow.role?.toUpperCase()}</span>
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter username to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}

"use client";

import { IconUserPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useUsers } from "../context/users-context";

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers();
  return (
    <Button className="space-x-1" onClick={() => setOpen("add")}>
      <span>Add User</span> <IconUserPlus size={18} />
    </Button>
  );
}

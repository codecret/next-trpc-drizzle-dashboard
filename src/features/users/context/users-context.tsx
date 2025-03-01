"use client";

import React, { useState } from "react";
import { AddUserTypes, TableUser, TableUserRow } from "../types";
import useDialogState from "@/utils/use-dialog-state";

type UsersDialogType = "invite" | "add" | "edit" | "delete";

interface UsersContextType {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: TableUserRow | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<TableUserRow | null>>;
}

const UsersContext = React.createContext<UsersContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<TableUserRow | null>(null);

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext>
  );
}

export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>");
  }

  return usersContext;
};

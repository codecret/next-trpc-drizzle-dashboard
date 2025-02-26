"use client";

import React from "react";
import { UsersPrimaryButtons } from "./user-add-button";
import { EmployeesTable } from "./EmployeesTable";
import UsersProvider from "../context/users-context";
import { UsersDialogs } from "./users-dialogs";

export function EmployeeContainer() {
  return (
    <UsersProvider>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User List</h2>
          <p className="text-muted-foreground">
            Manage your users and their roles here.
          </p>
        </div>
        <UsersPrimaryButtons />
      </div>
      <EmployeesTable />
      <UsersDialogs />
    </UsersProvider>
  );
}

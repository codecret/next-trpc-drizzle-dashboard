"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc/client";
import { useContext } from "react";
import { AppContext } from "@/app/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export function EmployeesTable() {
  const searchParams = useSearchParams();
  const searchEmployee = searchParams.get("query") || "";
  const debouncedSearchQuery = useDebounce(searchEmployee || "", 1000);

  console.log("search from table", searchEmployee);

  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: employees, isLoading } = trpc.user.getUsers.useQuery(
    {
      searchEmployee: debouncedSearchQuery,
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
  const { setEditedUserId } = useContext(AppContext);

  const deleteUserMutation = trpc.user.deleteUserId.useMutation();
  const onDelete = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId, {
      onSuccess: () => {
        utils.user.getUsers.invalidate();
      },
    });
  };
  if (isLoading) return <div>Loading...</div>;
  if (employees?.length === 0) return <div>No Users</div>;
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees?.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={employee.image as string}
                      alt={employee.name}
                    />
                    <AvatarFallback>{employee.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{employee.name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditedUserId(employee.id);
                        router.push("/admin/add-employee");
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(employee.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

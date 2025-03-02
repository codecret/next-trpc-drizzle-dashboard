import { ColumnDef, Row } from "@tanstack/react-table";
import { cn } from "@/utils";
import { Checkbox } from "@/components/ui/checkbox";
import LongText from "@/components/long-text";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { TUser } from "../types";

export const columns: ColumnDef<TUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original?.image ?? ""} alt={row.original?.name} />
        <AvatarFallback>{row.original.name[0]}</AvatarFallback>
      </Avatar>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue("username")}</LongText>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell"
      ),
    },
    enableHiding: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { name } = row.original;
      return <LongText className="max-w-36">{name}</LongText>;
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
  },
  //   {
  //     accessorKey: "phoneNumber",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Phone Number" />
  //     ),
  //     cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  //     enableSorting: false,
  //   },
  //   {
  //     accessorKey: "status",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Status" />
  //     ),
  //     cell: ({ row }) => {
  //       console.log(row);

  //       //   const { status } = row.original;
  //       //   const badgeColor = callTypes.get(status);
  //       return (
  //         <div className="flex space-x-2">
  //           {/* <Badge variant="outline" className={cn("capitalize", badgeColor)}>
  //             {row.getValue("status")}
  //           </Badge> */}
  //         </div>
  //       );
  //     },
  //     filterFn: (row, id, value) => {
  //       return value.includes(row.getValue(id));
  //     },
  //     enableHiding: false,
  //     enableSorting: false,
  //   },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      //   console.log(row.getValue("role"));
      //   console.log(row.original.role);

      return (
        <div className="flex items-center gap-x-2">
          {/* {userType.icon && (
            <userType.icon size={16} className="text-muted-foreground" />
          )} */}
          <span className="text-sm capitalize">{row.getValue("role")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

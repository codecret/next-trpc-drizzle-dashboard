"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/utils/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PasswordInput } from "@/components/password-input";
import { SelectDropdown } from "@/components/select-dropdown";
import { filteredUserTypes, TUser } from "../types";
import { useEditProject } from "@/hooks/useEmployees";
import { mutationHandler } from "@/utils/mutationHandler";
import { trpc } from "@/lib/trpc/client";

// Schema for editing a user, TODO: extend shared schema with create user schema
const userEditSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z.string().min(1, { message: "Username is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Email is invalid." }),
  role: z.enum(["admin", "user", "superadmin"]),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .optional()
    .or(z.literal("")),
});

type UserEditForm = z.infer<typeof userEditSchema>;

interface Props {
  currentRow: TUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersEditDialog({ currentRow, open, onOpenChange }: Props) {
  const form = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: currentRow.name,
      username: currentRow.username || "",
      email: currentRow.email,
      role: (currentRow.role as "admin" | "user" | "superadmin") || "user",
      password: "",
    },
  });

  const mutationEdit = useEditProject();
  const utils = trpc.useUtils();

  const adaptedToast = {
    success: (message: string) => toast({ title: message, variant: "default" }),
    error: (message: string) =>
      toast({ title: message, variant: "destructive" }),
  };

  const onSubmit = async (values: UserEditForm) => {
    // Prepare the data for submission
    const submissionData = { ...values };

    // If password is empty, remove it from the submission
    if (!values.password) {
      delete submissionData.password;
    }

    await mutationHandler(
      async () => {
        await mutationEdit.mutateAsync({
          userId: currentRow.id,
          ...submissionData,
        });
      },
      {
        onSuccess: async () => {
          await utils.user.getUsers.invalidate();
        },
        successMessage: "Employee Edited Successfully",
        errorMessage: "Failed to Edit Employee.",
      },
      adaptedToast
    );

    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@gmail.com"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel>Role</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a role"
                      className="col-span-4"
                      items={filteredUserTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Leave empty to keep current password"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="user-edit-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

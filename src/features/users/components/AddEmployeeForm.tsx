"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { AppContext } from "@/app/context/AppContext";
import { useContext, useEffect } from "react";
import { useAddProject, useEditProject } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { mutationHandler } from "@/hooks/mutationHandler";

const formSchema = (editedUserId: string) =>
  z.object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    password: z.string().superRefine((val, ctx) => {
      // Password is required only in "Add" mode (when editedUserId is empty)
      if (!editedUserId && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required.",
        });
      } else if (val.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 5,
          inclusive: true,
          type: "string",
          message: "Password must be at least 5 characters long.",
        });
      }
    }),
    role: z.enum(["admin", "user"], {
      message: "Role must be either 'admin' or 'user'.",
    }),
  });

export function AddEmployeeForm() {
  const { editedUserId, setEditedUserId } = useContext(AppContext);
  const { data } = trpc.user.userById.useQuery(editedUserId, {
    enabled: !!editedUserId,
  });
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const router = useRouter();
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(editedUserId)),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "", // Password is optional, so it can be empty
      role: "user",
    },
  });

  const mutationAdd = useAddProject();
  const mutationEdit = useEditProject();

  const adaptedToastAddEmployee = {
    success: (message: string) => toast({ title: message, variant: "default" }), // Adapt success
    error: (message: string) =>
      toast({ title: message, variant: "destructive" }),
  };
  const adaptedToastEditEmployee = {
    success: (message: string) => toast({ title: message, variant: "default" }), // Adapt success
    error: (message: string) =>
      toast({ title: message, variant: "destructive" }),
  };

  async function onSubmit(values: z.infer<ReturnType<typeof formSchema>>) {
    const payload = {
      ...values,
      password: values.password || "",
    };
    if (editedUserId) {
      // If in edit mode, call editUser mutation instead of addUser
      await mutationHandler(
        async () => {
          await mutationEdit.mutateAsync({ userId: editedUserId, ...payload });
        },
        {
          onSuccess: async () => {
            await utils.user.getUsers.refetch();
            router.push("/admin/all-employees");
          },
          successMessage: "Employee Edited Successfully",
          errorMessage: "Failed to Edit Employee.",
        },
        adaptedToastEditEmployee
      );
      return;
    }

    await mutationHandler(
      async () => {
        await mutationAdd.mutateAsync(payload);
      },
      {
        onSuccess: async () => {
          await utils.user.getUsers.refetch();
          router.push("/admin/all-employees");
        },
        successMessage: "Employee Added Successfully",
        errorMessage: "Failed to Add Employee.",
      },
      adaptedToastAddEmployee
    );
  }

  function onClear() {
    setEditedUserId("");
    form.reset();
  }

  useEffect(() => {
    if (data) {
      // If data is available (Edit mode), reset the form with the fetched user data
      form.reset({
        name: data.name ?? "",
        email: data.email ?? "",
        username: data.username ?? "",
        password: "", // Password is not fetched, so it remains empty
        role: (data.role as "admin" | "user") ?? "user",
      });
    } else {
      // If no data (Add mode), reset the form to its default empty state
      form.reset({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "user",
      });
    }
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          {editedUserId ? "Edit Employee" : "Add New Employee"}
        </h2>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="outline" onClick={onClear}>
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

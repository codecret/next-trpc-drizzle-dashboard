"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/utils";
import { Icons } from "../../../components/ui/icons";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "@/utils/use-toast";
import { useParams, useRouter } from "next/navigation";

export function UserAuthFormRegister({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { locale } = useParams();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await authClient.signUp.email(
      {
        email,
        password,
        name,
        username: name,
        role: "admin",
      },
      {
        onSuccess: () => {
          toast({ variant: "default", title: "Success", duration: 2000 });
          router.push("/auth/sign-in");
        },
        onError: (ctx) => {
          toast({
            variant: "destructive",
            title: ctx.error?.message || "An error occurred",
            duration: 2000,
          });
        },
      }
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="codecret"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder=""
              type="password"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
          <div className="mx-auto  flex justify-center gap-1 text-sm text-muted-foreground">
            <p>Already have an account?</p>
            <Link href={"/auth/sign-in"} className="font-medium text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

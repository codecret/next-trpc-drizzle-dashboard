"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/utils";
import { Icons } from "../../../components/ui/icons";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { FaGoogle } from "react-icons/fa";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const signInApple = async () => {
  //   const data = await authClient.signIn.social(
  //     {
  //       provider: "apples",
  //       callbackURL: "/dashboard/overview",
  //     },
  //     {
  //       onSuccess: () => {
  //         console.log("onsuccess");

  //         toast({
  //           variant: "default",
  //           title: "Sign In Successfully",
  //           duration: 2000,
  //         });
  //       },
  //       onError: (ctx) => {
  //         toast({
  //           variant: "destructive",
  //           title: ctx.error?.message || "An error occurred",
  //           duration: 2000,
  //         });
  //       },
  //     }
  //   );
  // };
  const signInGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard/overview",
      },
      {
        onSuccess: () => {
          console.log("onsuccess");

          toast({
            variant: "default",
            title: "Sign In Successfully",
            duration: 2000,
          });
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
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await authClient.signIn.username(
      {
        username,
        password,
      },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Sign In Successfully",
            duration: 2000,
          });
          router.push("/dashboard/overview");
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

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Name"
              type="name"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
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
            Sign In with Username
          </Button>
        </div>
      </form>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInGoogle()}
      >
        <FaGoogle className="mr-2 size-5" />
        Log in with Google
      </Button>
      {/* <Button
        variant="outline"
        className="w-full"
        onClick={() => signInApple()}
      >
        <FaApple className="mr-2 size-5" />
        Log in with Apple
      </Button> */}
    </div>
  );
}

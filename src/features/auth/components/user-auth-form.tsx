"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/utils";
import { toast } from "@/utils/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await authClient.signIn.username(
      {
        username,
        password,
      },
      {
        // TODO: remove this toast, pass onSuccess prop from UserAuthFormProps to keep this component clean
        onSuccess: (_data) => {
          // props?.onSuccess?.(data);
          toast({
            variant: "default",
            title: "Sign In Successfully",
            duration: 2000,
          });
          router.push("/dashboard/overview");
        },
        // TODO: remove this toast, pass onError prop from UserAuthFormProps to keep this component clean
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
    </div>
  );
}

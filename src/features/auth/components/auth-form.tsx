"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { loginAction, registerAction } from "@/src/features/auth/actions";
import {
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
} from "@/src/features/auth/schemas";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              const result = await loginAction(values);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success("Welcome back");
              router.push("/dashboard");
            });
          })}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
          </div>
          <Button disabled={isPending} type="submit">
            Sign in
          </Button>
          <p className="text-sm text-zinc-500">
            No account?{" "}
            <Link className="underline" href="/register">
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      workspaceId: "",
      role: "OWNER",
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              const result = await registerAction(values);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success("Account created");
              router.push("/dashboard");
            });
          })}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace">Workspace ID</Label>
            <Input id="workspace" {...form.register("workspaceId")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
          </div>
          <Button disabled={isPending} type="submit">
            Create account
          </Button>
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

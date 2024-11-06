"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login, initiatePasswordReset } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      const result = await login(values);
      if (result && result.error) {
        setError(result.error);
      }
    });
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setError(undefined);
    setResetSuccess(false);
    startTransition(async () => {
      try {
        const result = await initiatePasswordReset({ email });
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setResetSuccess(true);
          setEmail("");
        }
      } catch (err) {
        setError("Failed to send reset email");
      }
    });
  }

  return (
    <div className="space-y-4">
      {!showForgotPassword ? (
        // Regular Login Form
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && <p className="text-center text-destructive">{error}</p>}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Log in
            </LoadingButton>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-sm text-muted-foreground hover:text-primary mt-2"
            >
              Forgot password?
            </button>
          </form>
        </Form>
      ) : (
        // Simplified Forgot Password Form
        <form onSubmit={handlePasswordReset} className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {resetSuccess && (
            <Alert>
              <AlertDescription>
                If an account exists with this email, you will receive password
                reset instructions.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <LoadingButton loading={isPending} type="submit" className="w-full">
            Reset Password
          </LoadingButton>
          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(false);
              setError(undefined);
              setResetSuccess(false);
              setEmail("");
            }}
            className="w-full text-sm text-muted-foreground hover:text-primary mt-2"
          >
            Back to login
          </button>
        </form>
      )}
    </div>
  );
}

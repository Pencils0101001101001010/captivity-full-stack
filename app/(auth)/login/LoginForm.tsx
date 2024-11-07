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
import { Button } from "@/components/ui/button"; // Make sure to import Button
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login, initiatePasswordReset } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

// Email validation schema remains the same
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Form setup and handlers remain the same
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
    setEmailError("");

    try {
      emailSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailError(err.errors[0]?.message || "Invalid email");
        return;
      }
    }

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
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      autoComplete="username"
                      {...field}
                    />
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
                    <PasswordInput
                      placeholder="Password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
              >
                Log in
              </LoadingButton>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-sm"
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        // Forgot Password Form
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
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="Enter your email address"
              autoComplete="email"
              className={emailError ? "border-destructive" : ""}
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Reset Password
            </LoadingButton>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForgotPassword(false);
                setError(undefined);
                setResetSuccess(false);
                setEmail("");
                setEmailError("");
              }}
              className="w-full text-sm"
            >
              Back to login
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

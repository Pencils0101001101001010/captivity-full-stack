// app/reset-password/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { resetPassword } from "../login/actions";
import { FormValues, resetPasswordSchema } from "./validation";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Early return if no token or searchParams
  if (!searchParams || !token) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Invalid password reset link.</AlertDescription>
        </Alert>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    // We know token exists here because of the early return above
    const resetToken = token as string;

    setError(undefined);
    startTransition(async () => {
      try {
        const result = await resetPassword({
          token: resetToken,
          newPassword: values.newPassword,
        });

        if (result.error) {
          setError(result.error);
        } else if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
        }
      } catch (err) {
        setError("Failed to reset password");
      }
    });
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={isPending} className="w-full">
            Reset Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}

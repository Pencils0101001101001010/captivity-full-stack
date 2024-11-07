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
import { Button } from "@/components/ui/button";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login, initiatePasswordReset } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
});

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    // Remove leading and trailing spaces
    const value = e.target.value.trim();
    field.onChange(value);
  };

  async function onSubmit(values: LoginValues) {
    // Trim values before submission
    const trimmedValues = {
      username: values.username.trim(),
      password: values.password.trim(),
    };

    setError(undefined);
    startTransition(async () => {
      const result = await login(trimmedValues);
      if (result && result.error) {
        setError(result.error);
      }
    });
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError("");

    const trimmedEmail = email.trim();

    try {
      emailSchema.parse({ email: trimmedEmail });
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
        const result = await initiatePasswordReset({ email: trimmedEmail });
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
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      autoComplete="username"
                      {...field}
                      onChange={e => handleInputChange(e, field)}
                      onBlur={e => {
                        e.target.value = e.target.value.trim();
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Password"
                      autoComplete="current-password"
                      {...field}
                      onChange={e => handleInputChange(e, field)}
                      onBlur={e => {
                        e.target.value = e.target.value.trim();
                        field.onBlur();
                      }}
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
        <Form {...forgotPasswordForm}>
          <form onSubmit={handlePasswordReset} className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetSuccess && (
              <Alert>
                <AlertDescription>
                  If an account exists with this email, you will receive
                  password reset instructions.
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      {...field}
                      value={email}
                      onChange={e => {
                        const value = e.target.value.trim();
                        setEmail(value);
                        setEmailError("");
                        field.onChange(value);
                      }}
                      onBlur={e => {
                        const value = e.target.value.trim();
                        setEmail(value);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
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
                  forgotPasswordForm.reset();
                }}
                className="w-full text-sm"
              >
                Back to login
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

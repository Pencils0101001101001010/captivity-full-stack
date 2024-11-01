import { z } from "zod";
import { accountFormSchema } from "./validation";

export type FormValues = z.infer<typeof accountFormSchema>;

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  avatarUrl: string | null;
}

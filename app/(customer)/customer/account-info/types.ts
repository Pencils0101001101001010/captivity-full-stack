export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "SUBSCRIBER"
  | "PROMO"
  | "DISTRIBUTOR"
  | "SHOPMANAGER"
  | "EDITOR"
  | "ADMIN";

export interface SessionUser {
  id: string;
  captivityBranch: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: UserRole;
}

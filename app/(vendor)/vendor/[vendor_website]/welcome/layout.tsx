// app/layout.tsx
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to our store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();
  return <main>{children}</main>;
}

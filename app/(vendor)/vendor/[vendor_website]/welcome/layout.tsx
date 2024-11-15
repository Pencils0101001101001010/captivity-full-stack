import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to our store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}

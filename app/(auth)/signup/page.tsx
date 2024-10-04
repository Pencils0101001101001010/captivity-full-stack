import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Captivity</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <div>
          {/* Right side: Adding the logo image */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
            <Image
              src="/captivity-logo-white.png" // Path to the image in the public folder
              alt="Captivity Logo"
              width={331}
              height={54}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}

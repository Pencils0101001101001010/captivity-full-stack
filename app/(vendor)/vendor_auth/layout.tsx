import { ReactNode } from "react";

interface VendorAuthLayoutProps {
  children: ReactNode;
}

export default function VendorAuthLayout({ children }: VendorAuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <nav className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="font-semibold text-xl">Exclusive Shopping</div>
          <div className="text-sm text-muted-foreground">
            Need help? Contact support
          </div>
        </nav>
      </header>

      <main className="pt-16">{children}</main>

      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Exclusive Shopping. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

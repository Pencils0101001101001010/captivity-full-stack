// page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorLoginForm } from "./_components/VendorLoginForm";
import { VendorRegisterForm } from "./_components/VendorRegisterForm";

export default function VendorPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Vendor Portal
          </CardTitle>
          <CardDescription className="text-center">
            Login or register as a vendor to manage your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4 mt-4">
                <VendorLoginForm />
              </div>
            </TabsContent>
            <TabsContent value="register">
              <div className="space-y-4 mt-4">
                <VendorRegisterForm />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

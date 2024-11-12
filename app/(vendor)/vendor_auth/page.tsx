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
import { motion } from "framer-motion";
import { ShoppingBag, Percent, Gift, Clock } from "lucide-react";

export default function VendorPage() {
  const benefits = [
    {
      icon: <Percent className="w-8 h-8 text-primary" />,
      title: "Special Pricing",
      description: "Access exclusive wholesale prices and discounts",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: "Early Access",
      description: "Shop new products before they go public",
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "Rewards",
      description: "Earn points on every purchase",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "Priority customer service",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl space-y-6 text-center lg:text-left"
          >
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome to
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 ml-2">
                  Exclusive Shopping
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join our exclusive customer program to unlock special prices and
                early access to products.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center lg:items-start p-4 rounded-lg bg-card/50 backdrop-blur-sm border shadow-2xl shadow-black"
                >
                  <div className="mb-3">{benefit.icon}</div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground text-center lg:text-left">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-2 shadow-2xl shadow-black">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Customer Access
                </CardTitle>
                <CardDescription className="text-center">
                  Login or register to access exclusive deals
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

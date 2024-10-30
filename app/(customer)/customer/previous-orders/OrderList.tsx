//!on the order add the users who's placed the orders information
//!add search parameters and pagination
"use client";

import React from "react";
import { Order } from "./types";
import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Building2,
  User2,
  Calendar,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Building,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PrintButton } from "./_components/PrintButton";

interface OrderHistoryProps {
  orders?: Order[];
  error?: string;
}

export function OrderHistory({ orders, error }: OrderHistoryProps) {
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-destructive space-x-2">
            <span className="text-lg">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No orders have been placed yet
            </p>
            <Button asChild>
              <Link href="/customer/shopping/product_categories/summer">
                Browse Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <Card key={order.id} className="group">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-xl">
                    #{order.id.slice(-8)}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PrintButton order={order} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>Order Details</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Collection Method</p>
                        <p className="text-sm text-muted-foreground">
                          {order.methodOfCollection}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Branch</p>
                        <p className="text-sm text-muted-foreground">
                          {order.captivityBranch}
                        </p>
                      </div>
                    </div>

                    {order.salesRep && (
                      <div className="flex items-start space-x-3">
                        <User2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Sales Representative</p>
                          <p className="text-sm text-muted-foreground">
                            {order.salesRep}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            {order.firstName} {order.lastName}
                          </p>
                          {order.companyName && (
                            <p className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {order.companyName}
                            </p>
                          )}
                          <p>{order.streetAddress}</p>
                          {order.apartmentSuite && (
                            <p>{order.apartmentSuite}</p>
                          )}
                          <p>
                            {order.townCity}, {order.province}
                          </p>
                          <p>{order.postcode}</p>
                          <p>{order.countryRegion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {order.phone}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold">Order Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map(item => (
                      <HoverCard key={item.id}>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                              <Image
                                src={
                                  item.variation.variationImageURL ||
                                  "/placeholder.png"
                                }
                                alt={item.variation.name}
                                className="object-cover"
                                fill
                                sizes="(max-width: 64px) 100vw"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">
                                {item.variation.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.variation.color} / {item.variation.size}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                R{item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Product Details
                            </p>
                            <p className="text-sm">SKU: {item.variation.sku}</p>
                            {item.variation.sku2 && (
                              <p className="text-sm">
                                SKU2: {item.variation.sku2}
                              </p>
                            )}
                            <p className="text-sm font-medium mt-2">Total</p>
                            <p className="text-sm">
                              R{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
            {order.orderNotes && (
              <div className="text-sm max-w-[70%]">
                <span className="font-medium">Order Notes: </span>
                <span className="text-muted-foreground">
                  {order.orderNotes}
                </span>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-semibold">
                R{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default OrderHistory;

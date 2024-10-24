"use server";

import prisma from "@/lib/prisma";
import { Order, ActionResponse } from "./types";

export async function getUserOrders(
  userId: string
): Promise<ActionResponse<Order[]>> {
  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            variation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: orders as Order[],
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Failed to fetch orders",
    };
  }
}

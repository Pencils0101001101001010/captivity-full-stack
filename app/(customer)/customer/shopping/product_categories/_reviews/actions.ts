"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Review } from "../types";

interface ReviewResponse {
  success: boolean;
  data?: any;
  error?: string;
}
export async function addReview(
  productId: string,
  rating: number,
  comment: string
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "You must be logged in to review" };
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId: user.id,
        helpful: 0,
        notHelpful: 0,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Review creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add review",
    };
  }
}

export async function getProductReviews(productId: string): Promise<{
  success: boolean;
  data: Review[];
  error?: string;
}> {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the data to match our Review interface
    const transformedReviews: Review[] = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      productId: review.productId,
      userId: review.userId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      helpful: review.helpful,
      notHelpful: review.notHelpful,
      user: {
        firstName: review.user.firstName,
        lastName: review.user.lastName,
      },
    }));

    return { success: true, data: transformedReviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, data: [], error: "Failed to fetch reviews" };
  }
}

export async function updateHelpful(reviewId: string, helpful: boolean) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        [helpful ? "helpful" : "notHelpful"]: {
          increment: 1,
        },
      },
    });

    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: "Failed to update helpful count" };
  }
}

// "use client";
// import React, { memo, useEffect, useState } from "react";
// import { StarIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { toast } from "sonner";
// import {
//   addReview,
//   updateHelpful,
// } from "@/app/(customer)/customer/actions/reviews";
// import { useSession } from "@/app/(customer)/SessionProvider";

// interface ReviewUser {
//   firstName: string;
//   lastName: string;
// }
// interface ReviewSectionProps {
//   productId: string;
//   initialReviews: Review[];
//   onReviewAdded: (review: Review) => void;
//   isLoading: boolean;
// }

// interface Review {
//   id: string;
//   rating: number;
//   comment: string | null;
//   productId: string;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   helpful: number;
//   notHelpful: number;
//   user: ReviewUser;
// }

// const ReviewSection: React.FC<ReviewSectionProps> = ({
//   productId,
//   initialReviews,
//   onReviewAdded,
//   isLoading,
// }) => {
//   const { user } = useSession();
//   const [reviews, setReviews] = useState<Review[]>(initialReviews);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [hoveredStar, setHoveredStar] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   const hasUserReviewed =
//     user && reviews.some(review => review.userId === user.id);

//   useEffect(() => {
//     setReviews(initialReviews);
//   }, [initialReviews]);

//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast.error("Please log in to leave a review");
//       return;
//     }

//     if (hasUserReviewed) {
//       toast.error("You have already reviewed this product");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const result = await addReview(productId, rating, comment);
//       if (result.success && result.data) {
//         const newReview: Review = {
//           ...result.data,
//           createdAt: new Date(result.data.createdAt),
//           updatedAt: new Date(result.data.updatedAt),
//         };
//         setReviews(prevReviews => [newReview, ...prevReviews]);
//         onReviewAdded(newReview);
//         setRating(0);
//         setComment("");
//         toast.success("Review submitted successfully");
//       } else {
//         toast.error(result.error || "Failed to submit review");
//       }
//     } catch (error) {
//       toast.error("Failed to submit review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
//     if (!user) {
//       toast.error("Please log in to mark reviews as helpful");
//       return;
//     }

//     const result = await updateHelpful(reviewId, isHelpful);
//     if (result.success) {
//       setReviews(prevReviews =>
//         prevReviews.map(review =>
//           review.id === reviewId ? { ...review, ...result.data } : review
//         )
//       );
//     }
//   };

//   const averageRating = reviews.length
//     ? (
//         reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
//       ).toFixed(1)
//     : "0.0";

//   return (
//     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//       {isLoading ? (
//         <div>Loading reviews...</div>
//       ) : (
//         <>
//           <CollapsibleTrigger asChild>
//             <Button variant="outline" className="w-full mb-4">
//               Reviews ({reviews.length}) - Average Rating: {averageRating}
//               <div className="flex ml-2">
//                 {[1, 2, 3, 4, 5].map(star => (
//                   <StarIcon
//                     key={star}
//                     className={`h-4 w-4 ${
//                       star <= Number(averageRating)
//                         ? "text-yellow-400 fill-yellow-400"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </Button>
//           </CollapsibleTrigger>

//           <CollapsibleContent>
//             <div className="space-y-6">
//               {user && !hasUserReviewed && (
//                 <Card>
//                   <form onSubmit={handleSubmitReview}>
//                     <CardHeader>
//                       <CardTitle>Write a Review</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="flex gap-1">
//                         {[1, 2, 3, 4, 5].map(star => (
//                           <button
//                             key={star}
//                             type="button"
//                             onClick={() => setRating(star)}
//                             onMouseEnter={() => setHoveredStar(star)}
//                             onMouseLeave={() => setHoveredStar(0)}
//                           >
//                             <StarIcon
//                               className={`h-6 w-6 transition-colors ${
//                                 star <= (hoveredStar || rating)
//                                   ? "text-yellow-400 fill-yellow-400"
//                                   : "text-gray-300"
//                               }`}
//                             />
//                           </button>
//                         ))}
//                       </div>
//                       <Textarea
//                         placeholder="Share your experience with this product..."
//                         value={comment}
//                         onChange={e => setComment(e.target.value)}
//                         className="min-h-[100px]"
//                       />
//                     </CardContent>
//                     <CardFooter>
//                       <Button
//                         type="submit"
//                         disabled={!rating || !comment.trim() || isSubmitting}
//                       >
//                         {isSubmitting ? "Submitting..." : "Submit Review"}
//                       </Button>
//                     </CardFooter>
//                   </form>
//                 </Card>
//               )}

//               <div className="space-y-4">
//                 {reviews.map(review => (
//                   <Card key={review.id}>
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <CardTitle>
//                             {review.user.firstName} {review.user.lastName}
//                           </CardTitle>
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map(star => (
//                               <StarIcon
//                                 key={star}
//                                 className={`h-4 w-4 ${
//                                   star <= review.rating
//                                     ? "text-yellow-400 fill-yellow-400"
//                                     : "text-gray-300"
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <CardDescription>
//                           {new Date(review.createdAt).toLocaleDateString()}
//                         </CardDescription>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-gray-700">{review.comment}</p>
//                     </CardContent>
//                     <CardFooter>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleHelpful(review.id, true)}
//                         >
//                           👍 Helpful ({review.helpful})
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleHelpful(review.id, false)}
//                         >
//                           👎 Not Helpful ({review.notHelpful})
//                         </Button>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </CollapsibleContent>
//         </>
//       )}
//     </Collapsible>
//   );
// };

// export default ReviewSection;

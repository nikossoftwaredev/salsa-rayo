"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import {
  getGoogleReviews,
  PlaceReviewsResponse,
} from "@/server-actions/getGoogleReviews";

interface ReviewsProps {
  placeId: string;
}

const GoogleReviews = ({ placeId }: ReviewsProps) => {
  const [reviewsData, setReviewsData] = useState<PlaceReviewsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getGoogleReviews(placeId);
        if (data) {
          setReviewsData(data);
        }
      } catch (err) {
        console.error("Failed to fetch Google reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    if (placeId) fetchReviews();
  }, [placeId]);

  if (loading) {
    return (
      <div className="relative bg-background w-72 overflow-hidden border border-muted rounded-lg shadow-md">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500" />
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-sm text-foreground/70">
              Loading reviews...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewsData) {
    return null;
  }

  const { rating, user_ratings_total, url, reviews } = reviewsData;

  if (rating === 0 || !reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-background w-72 overflow-hidden border border-muted rounded-lg shadow-md">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500" />

      <div className="p-6">
        <div className="flex gap-4">
          {/* Google Icon - 30% width */}
          <div className="flex-[0_0_30%] flex items-center justify-center">
            <FcGoogle className="text-5xl" />
          </div>

          {/* Content - 70% width */}
          <div className="flex-[0_0_70%] flex flex-col justify-center">
            {/* Title */}
            <h3 className="text-foreground font-medium text-lg mb-2">
              Google Rating
            </h3>

            {/* Rating and stars */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-orange-500">
                {rating?.toFixed(1) ?? "0.0"}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  const isFilled = rating ? rating >= starValue : false;
                  const isPartiallyFilled = rating
                    ? rating >= starValue - 0.5 && rating < starValue
                    : false;

                  return (
                    <div key={i} className="relative">
                      {/* Background star (empty) */}
                      <svg
                        className="w-5 h-5 text-muted absolute"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.785.57-1.84-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                      {/* Filled star */}
                      {(isFilled || isPartiallyFilled) && (
                        <svg
                          className="w-5 h-5 text-yellow-400 relative"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.785.57-1.84-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews link */}
            <a
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Read our {user_ratings_total ?? 0} reviews
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;

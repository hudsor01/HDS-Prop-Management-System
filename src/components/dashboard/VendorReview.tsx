import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface VendorReviewProps {
  vendorId: string;
  propertyId: string;
  onReviewSubmitted?: () => void;
}

const VendorReview = ({
  vendorId,
  propertyId,
  onReviewSubmitted,
}: VendorReviewProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: "",
    jobDate: "",
    jobType: "",
    cost: "",
    responseTime: "",
    professionalism: 0,
    quality: 0,
  });

  const handleRatingClick = (
    category: "rating" | "professionalism" | "quality",
    value: number,
  ) => {
    setFormData((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("vendor_reviews").insert([
        {
          vendor_id: vendorId,
          property_id: propertyId,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          rating: formData.rating,
          review_text: formData.reviewText,
          job_date: formData.jobDate,
          job_type: formData.jobType,
          cost: parseFloat(formData.cost),
          response_time: formData.responseTime,
          professionalism: formData.professionalism,
          quality: formData.quality,
        },
      ]);

      if (error) throw error;
      if (onReviewSubmitted) onReviewSubmitted();

      setFormData({
        rating: 0,
        reviewText: "",
        jobDate: "",
        jobType: "",
        cost: "",
        responseTime: "",
        professionalism: 0,
        quality: 0,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const RatingStars = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`hover:text-yellow-400 ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
        >
          <Star className="h-6 w-6" />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Vendor Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <RatingStars
              value={formData.rating}
              onChange={(value) => handleRatingClick("rating", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Review</Label>
            <Textarea
              value={formData.reviewText}
              onChange={(e) =>
                setFormData({ ...formData, reviewText: e.target.value })
              }
              placeholder="Share your experience with this vendor..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Date</Label>
              <Input
                type="date"
                value={formData.jobDate}
                onChange={(e) =>
                  setFormData({ ...formData, jobDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Job Type</Label>
              <Input
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({ ...formData, jobType: e.target.value })
                }
                placeholder="e.g., Plumbing, Electrical"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cost</Label>
              <Input
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                placeholder="$"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Response Time</Label>
              <Input
                value={formData.responseTime}
                onChange={(e) =>
                  setFormData({ ...formData, responseTime: e.target.value })
                }
                placeholder="e.g., Same day, Within 24hrs"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Professionalism</Label>
            <RatingStars
              value={formData.professionalism}
              onChange={(value) => handleRatingClick("professionalism", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Work Quality</Label>
            <RatingStars
              value={formData.quality}
              onChange={(value) => handleRatingClick("quality", value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorReview;

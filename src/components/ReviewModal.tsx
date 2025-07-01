
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceType: string;
  isVerified?: boolean;
  helpfulCount?: number;
  images?: string[];
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  serviceType: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  canWriteReview?: boolean;
  onSubmitReview?: (review: { rating: number; comment: string; images: string[] }) => void;
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

const ReviewModal = ({
  isOpen,
  onClose,
  providerName,
  serviceType,
  reviews,
  averageRating,
  totalReviews,
  canWriteReview = false,
  onSubmitReview,
  onMarkHelpful,
  onReport
}: ReviewModalProps) => {
  const [showForm, setShowForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReview = (reviewData: { rating: number; comment: string; images: string[] }) => {
    onSubmitReview?.(reviewData);
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card className="glass-card text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                {showForm ? 'Write a Review' : `Reviews for ${providerName}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {showForm ? (
              <ReviewForm
                serviceType={serviceType}
                providerName={providerName}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <ReviewsList
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
                showWriteReview={canWriteReview}
                onWriteReview={() => setShowForm(true)}
                onMarkHelpful={onMarkHelpful}
                onReport={onReport}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewModal;

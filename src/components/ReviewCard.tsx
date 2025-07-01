
import React from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showActions?: boolean;
}

const ReviewCard = ({ review, onMarkHelpful, onReport, showActions = true }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="glass-card text-white">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img 
            src={review.customerAvatar} 
            alt={review.customerName}
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{review.customerName}</h4>
                {review.isVerified && (
                  <Badge className="bg-green-500 text-white text-xs">Verified</Badge>
                )}
              </div>
              <span className="text-gray-400 text-sm">{formatDate(review.date)}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <Badge variant="outline" className="border-white/30 text-gray-300 text-xs">
                {review.serviceType}
              </Badge>
            </div>
            
            <p className="text-gray-300 mb-3">{review.comment}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mb-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            
            {showActions && (
              <div className="flex items-center space-x-4 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkHelpful?.(review.id)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-0 h-auto"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpfulCount || 0})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReport?.(review.id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-white/10 p-0 h-auto"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

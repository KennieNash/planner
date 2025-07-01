
import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  serviceType: string;
  providerName: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    images: string[];
  }) => void;
  onCancel: () => void;
}

const ReviewForm = ({ serviceType, providerName, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload to a storage service
      // For now, we'll create placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `/placeholder.svg?review-image-${Date.now()}-${index}`
      );
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please write at least 10 characters in your review.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSubmit({
        rating,
        comment: comment.trim(),
        images
      });

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback."
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              starValue <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card className="glass-card text-white">
      <CardHeader>
        <CardTitle>Review {providerName}</CardTitle>
        <p className="text-gray-300">Service: {serviceType}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating *</label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-gray-300">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review *</label>
          <Textarea
            placeholder="Share your experience with this service provider..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px]"
            maxLength={1000}
          />
          <p className="text-xs text-gray-400 mt-1">
            {comment.length}/1000 characters (minimum 10)
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Add Photos (Optional)</label>
          <div className="space-y-3">
            {images.length < 5 && (
              <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400">
                    Click to upload images ({images.length}/5)
                  </span>
                </label>
              </div>
            )}
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-white/30 text-gray-300 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

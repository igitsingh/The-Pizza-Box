'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

interface FeedbackCardProps {
    orderId: string;
    orderStatus: string;
    customerPhone?: string; // For guest users
}

export default function FeedbackCard({ orderId, orderStatus, customerPhone }: FeedbackCardProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackExists, setFeedbackExists] = useState(false);
    const [existingFeedback, setExistingFeedback] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkFeedback();
    }, [orderId]);

    const checkFeedback = async () => {
        try {
            const res = await api.get(`/feedback/check/${orderId}`);
            if (res.data.exists) {
                setFeedbackExists(true);
                setExistingFeedback(res.data.feedback);
            }
        } catch (error) {
            console.error('Failed to check feedback', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/feedback', {
                orderId,
                rating,
                review: review.trim() || null,
                guestPhone: customerPhone || undefined
            });

            toast.success('Thank you for your feedback!');
            setFeedbackExists(true);
            checkFeedback();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't show if order is not delivered
    if (orderStatus !== 'DELIVERED') {
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>
        );
    }

    // Already submitted feedback
    if (feedbackExists && existingFeedback) {
        return (
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-green-600 text-green-600" />
                    Thank You for Your Feedback!
                </h3>
                <div className="space-y-3">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-5 w-5 ${star <= existingFeedback.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    {existingFeedback.review && (
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-sm text-gray-700 italic">"{existingFeedback.review}"</p>
                        </div>
                    )}
                    {existingFeedback.adminResponse && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-semibold text-blue-900 mb-1">Response from The Pizza Box:</p>
                            <p className="text-sm text-blue-800">{existingFeedback.adminResponse}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Feedback form
    return (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-sm border border-orange-200">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">🎉 How was your experience?</h3>
            <p className="text-sm text-gray-600 mb-4">
                Your feedback helps us serve you better!
            </p>

            {/* Star Rating */}
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Rate your order:</p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-200'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        {rating === 5 && '⭐ Excellent!'}
                        {rating === 4 && '😊 Great!'}
                        {rating === 3 && '👍 Good'}
                        {rating === 2 && '😐 Okay'}
                        {rating === 1 && '😞 Poor'}
                    </p>
                )}
            </div>

            {/* Review Text */}
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                    Share your thoughts (optional):
                </p>
                <Textarea
                    placeholder="Tell us about your experience..."
                    value={review}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReview(e.target.value)}
                    rows={3}
                    className="resize-none bg-white"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                    {review.length}/500 characters
                </p>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-11"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                    </>
                ) : (
                    'Submit Feedback'
                )}
            </Button>
        </div>
    );
}

import React, { useState } from 'react';
import StarRating from './StarRating';
import Notification from './Notification';

function ReviewForm({ productId, onReviewSubmitted, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for notification
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating.");
      setLoading(false);
      return;
    }
    if (!comment.trim()) {
      setError("Please enter your review comments.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, rating, comment }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      showNotification('Review submitted successfully!', 'success');
      if (onReviewSubmitted) {
        onReviewSubmitted(data);
      }
      setRating(0);
      setComment('');
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      p-6
      border border-gray-200 dark:border-gray-700
      rounded-xl
      bg-white dark:bg-gray-800
      shadow-lg
      transform transition-all duration-300 ease-in-out
      scale-100 opacity-100
    ">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 text-center">
        Leave a Review
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Rating:
          </label>
          <div className="flex justify-center">
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Comments:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            className="
              mt-1 block w-full p-3
              rounded-lg
              border border-gray-300 dark:border-gray-600
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              bg-gray-50 dark:bg-gray-700
              text-gray-900 dark:text-white
              transition-all duration-200 ease-in-out
              placeholder-gray-400 dark:placeholder-gray-500
            "
            placeholder="Share your thoughts on the product..."
            required
          ></textarea>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm font-medium animate-pulse">
            ⚠️ {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                px-5 py-2.5
                border border-gray-300 dark:border-gray-500
                rounded-lg
                shadow-sm
                text-base font-medium
                text-gray-700 dark:text-gray-200
                bg-white dark:bg-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-500
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                transition-colors duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="
              px-5 py-2.5
              border border-transparent
              rounded-lg
              shadow-sm
              text-base font-medium
              text-white
              bg-blue-600 hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={loading}
          >
            {loading ? 'Submitting... 🚀' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
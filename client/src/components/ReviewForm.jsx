import React, { useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ postId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!currentUser) {
      validationErrors.user = "You must be logged in to submit a review.";
    }
    if (!rating || rating < 1 || rating > 5) {
      validationErrors.rating = "Please provide a valid rating between 1 and 5.";
    }
    if (!comment.trim()) {
      validationErrors.comment = "Comment cannot be empty.";
    }
    return validationErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/posts/${postId}/reviews`,
          { rating, comment },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        onReviewAdded(response.data);
        setRating(0);
        setComment("");
        setErrors({});
        navigate(0);
      } catch (error) {
        setErrors({ form: "Failed to submit review. Please try again later." });
      } finally {
        setIsSubmitting(false);
      }
    },
    [rating, comment, postId, currentUser, onReviewAdded, navigate]
  );

  return (
    <form
      id="commentForm"
      onSubmit={handleSubmit}
      className="mt-6 p-4 bg-grid-item-bg rounded-lg shadow-md"
    >
      <h4 className="text-2xl font-semibold text-primary-text mb-4">Leave a Review</h4>

      {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}

      <div className="mb-4">
        <label htmlFor="rating" className="block text-primary-text font-medium mb-2">
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="w-full px-3 py-2 border rounded-lg text-primary-text bg-white focus:ring-2 focus:ring-primary-accent focus:outline-none"
        >
          <option value={0} disabled>
            Select Rating
          </option>
          <option value={1}>1 star</option>
          <option value={2}>2 stars</option>
          <option value={3}>3 stars</option>
          <option value={4}>4 stars</option>
          <option value={5}>5 stars</option>
        </select>
        {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-primary-text font-medium mb-2">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          cols="20"
          rows="5"
          required
          className="w-full px-3 py-2 border rounded-lg text-primary-text bg-white focus:ring-2 focus:ring-primary-accent focus:outline-none"
        ></textarea>
        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
      </div>

      <button
        type="submit"
        className={`w-full py-2 bg-primary-accent text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary-accent transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Submitting...
          </div>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
};

export default ReviewForm;

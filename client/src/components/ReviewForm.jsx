import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ postId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please provide a valid rating between 1 and 5.");
      return;
    }

    if (!comment || comment.trim() === "") {
      toast.error("Comment cannot be empty.");
      return;
    }

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
      toast.success("Review submitted!");
      navigate(0);
      onReviewAdded(response.data);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <form id="commentForm" onSubmit={handleSubmit} className="mt-6 p-4 bg-grid-item-bg rounded-lg shadow-md">
      <h4 className="text-2xl font-semibold text-primary-text mb-4">Leave a Review</h4>
      <div className="mb-4">
        <label htmlFor="rating" className="block text-primary-text font-medium mb-2">
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
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
      </div>
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
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-primary-accent text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary-accent transition"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;

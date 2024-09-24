import React, { useContext, useMemo } from "react";
import PostAuthor from "./PostAuthor";
import { UserContext } from "../context/userContext";

const ReviewsList = ({ reviews, onDeleteReview }) => {
  const { currentUser } = useContext(UserContext);

  // Memoize the list of reviews to prevent unnecessary re-renders
  const renderedReviews = useMemo(() => {
    return reviews.map((review) => (
      <li key={review._id} className="p-4 bg-grid-item-bg rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-2">
          <PostAuthor authorID={review.author._id} createdAt={review.createdAt} />
          {currentUser?.id === review.author._id && (
            <button
              onClick={() => onDeleteReview(review._id)}
              className="px-3 py-1 text-sm text-white bg-error-toast rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              aria-label="Delete review"
            >
              Delete
            </button>
          )}
        </div>
        <div className="text-sm text-primary-text mb-2" data-rating={review.rating}>
          Rated: {review.rating} stars
        </div>
        <p className="text-primary-text">{review.comment}</p>
      </li>
    ));
  }, [reviews, currentUser, onDeleteReview]);

  return (
    <div className="mt-8">
      <h4 className="text-2xl font-semibold text-primary-text mb-4">All Reviews</h4>

      {/* Render reviews or fallback UI */}
      {reviews.length > 0 ? (
        <ul className="space-y-4">{renderedReviews}</ul>
      ) : (
        <div className="text-center p-4 bg-glass-bg rounded-lg shadow-md mt-6">
          <p className="text-primary-text text-lg font-semibold mb-2">
            No reviews available yet.
          </p>
          <p className="text-primary-text">
            Be the first to share your thoughts! Click 
            <a href="#commentForm" className="text-primary-accent hover:underline ml-1">
              here
            </a> to add a review.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;

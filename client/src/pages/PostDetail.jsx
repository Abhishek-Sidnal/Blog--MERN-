import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
import PostAuthor from "../components/PostAuthor";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPostDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setPost(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        toast.error("Failed to fetch post details.");
      }
      setIsLoading(false);
    };
    getPostDetails();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted.");
    } catch (error) {
      toast.error("Failed to delete review.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-100 text-gray-900 w-full sm:w-3/4 mx-auto sm:my-10 rounded-lg ">
      {post && (
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post.creator && (
              <div className="flex gap-2 mt-2 sm:mt-0 mb-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="flex items-center justify-center px-4 py-1 text-base text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg shadow-md transition"
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          <div className="mb-6 mt-4">
            <img
              src={post.thumbnail}
              alt="Post Thumbnail"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h2>
          <div className="custom-content">
            <p
              className="break-words"
              dangerouslySetInnerHTML={{ __html: post.description }}
            ></p>
          </div>

          <ReviewForm postId={post._id} onReviewAdded={handleReviewAdded} />
          <ReviewsList reviews={reviews} onDeleteReview={handleDeleteReview} />
        </div>
      )}
    </section>
  );
};

export default PostDetail;

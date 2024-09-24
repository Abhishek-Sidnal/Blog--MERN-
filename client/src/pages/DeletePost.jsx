import React, { useContext, useCallback } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const DeletePost = ({ postId, onDelete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Memoize the removePost function to avoid re-creation on each render
  const removePost = useCallback(async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Post deleted successfully");
        
        // Call onDelete callback if provided
        if (onDelete) {
          onDelete(postId);
        }

        // Check if the current page needs to be refreshed or redirected
        if (location.pathname.startsWith(`/myposts`)) {
          navigate(0); // If needed, refresh the page
        } else {
          navigate("/"); // Redirect to home
        }
      }
    } catch (err) {
      console.error(err);

      // Handle errors with a user-friendly message
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete the post. Please try again.");
      }
    }
  }, [token, navigate, location, onDelete]);

  return (
    <button
      onClick={() => removePost(postId)}
      className="flex items-center justify-center px-4 py-1 text-base text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
    >
      Delete
    </button>
  );
};

export default DeletePost;

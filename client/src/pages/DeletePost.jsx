import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const DeletePost = ({ postId }) => {
  console.log("hello");
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const removePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        if (location.pathname.startsWith(`/myposts`)) {
          navigate(0); // Refresh the current page
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      // Log error for debugging
      console.error(err);

      // Display a user-friendly error message
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete the post. Please try again.");
      }
    }
  };

  return (
    <Link
      onClick={() => removePost(postId)}
      className="flex items-center justify-center px-4 py-1 text-base text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
    >
      Delete
    </Link>
  );
};

export default DeletePost;

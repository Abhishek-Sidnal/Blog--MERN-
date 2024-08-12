import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const DeletePost = ({ postId }) => {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0);
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
      className="bg-primary-text text-background px-4 py-2 rounded-lg hover:bg-accent transition duration-300"
    >
      Delete
    </Link>
  );
};

export default DeletePost;

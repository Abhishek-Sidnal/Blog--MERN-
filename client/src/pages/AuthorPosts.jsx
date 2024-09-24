import React, { useEffect, useState, useCallback } from "react";
import PostItem from "../components/PostItem";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL || "http://localhost:4000"}/posts/users/${id}`
      );
      setPosts(response?.data);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
      toast.error(error.response?.data?.message || "Error fetching posts");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-background text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        {error ? (
          <div className="text-center py-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500">
              {error}
            </h2>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostItem
                key={post._id}
                postID={post._id}
                thumbnail={post.thumbnail}
                category={post.category}
                title={post.title}
                description={post.description}
                authorID={post.creator}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-text">
              No Posts Available at this moment
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorPosts;

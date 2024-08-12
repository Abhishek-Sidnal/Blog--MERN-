import React, { useEffect, useState } from "react";
import PostItem from "../components/PostItem"; // Component for rendering individual post items
import toast from "react-hot-toast"; // For displaying error messages
import axios from "axios"; // For making HTTP requests
import Loader from "../components/Loader"; // Loading spinner component
import { useParams } from "react-router-dom"; // For accessing URL parameters

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const { category } = useParams(); // Get category from URL params

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}` // Fetch posts by category
        );
        setPosts(response?.data); // Store posts in state
      } catch (error) {
        toast.error(error.response.data.message); // Show error notification
      }
      setIsLoading(false); // Stop loading
    };
    fetchPosts();
  }, [category]); // Re-fetch posts when category changes

  if (isLoading) {
    return <Loader />; // Show loading spinner if data is being fetched
  }

  return (
    <section className="bg-background text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(
              ({
                _id: id,
                thumbnail,
                category,
                title,
                description,
                creator,
                createdAt,
              }) => (
                <PostItem
                  key={id}
                  postID={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  description={description}
                  authorID={creator}
                  createdAt={createdAt}
                />
              )
            )}
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

export default CategoryPosts;

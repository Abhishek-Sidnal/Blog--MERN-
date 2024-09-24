import React, { useEffect, useState, useMemo, useCallback } from "react";
import PostItem from "./PostItem";
import Loader from "./Loader";
import axios from "axios";
import toast from "react-hot-toast";

// Debounce function to limit the number of calls to the search function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch posts from API on component mount
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
      setPosts(response?.data);
      setFilteredPosts(response?.data); // Initialize filteredPosts with all posts
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load posts.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Debounce search to improve performance
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Memoize the filtered posts to avoid recalculating unnecessarily
  const displayedPosts = useMemo(() => {
    if (!searchQuery) {
      return posts;
    }
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, posts]);

  // Display a loader if posts are still being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Display an error message if fetching posts failed
  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <section className="p-4 bg-background bg-opacity-80 backdrop-blur-lg min-h-screen w-full">
      <div className="container mx-auto">
        <input
          type="text"
          placeholder="Search posts..."
          onChange={(e) => handleSearch(e.target.value)} // Debounced search
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
        />

        {/* Display posts or message when no posts are available */}
        {displayedPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map(
              ({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
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
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-800">No Posts Available at this moment</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;

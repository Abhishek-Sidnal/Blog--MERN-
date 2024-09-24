import React, { useEffect, useState, useMemo } from "react";
import PostItem from "../components/PostItem"; 
import toast from "react-hot-toast"; 
import axios from "axios"; 
import Loader from "../components/Loader"; 
import { useParams } from "react-router-dom"; 
import { debounce } from 'lodash'; // You can use lodash debounce for optimizing search

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null); // Error state for better error handling

  const { category } = useParams(); 

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); 
      setError(null); // Reset error on each fetch
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        );
        setPosts(response.data); 
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to load posts.";
        setError(errorMessage);
        toast.error(errorMessage); 
      }
      setIsLoading(false); 
    };
    fetchPosts();
  }, [category]); // Fetch posts whenever category changes

  // Debounced search handler to avoid excessive re-renders
  const handleSearch = useMemo(
    () => debounce((e) => setSearchQuery(e.target.value), 300),
    []
  );

  // Filtered posts derived from search query and posts list
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, posts]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-background text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        <input
          type="text"
          placeholder="Search posts..."
          onChange={handleSearch} // Use debounced search handler
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
        />
        
        {error ? (
          <div className="text-center py-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500">
              {error}
            </h2>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
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

export default CategoryPosts;

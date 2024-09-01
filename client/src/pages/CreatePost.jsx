import React, { useEffect, useState } from "react";
import PostItem from "../components/PostItem"; 
import toast from "react-hot-toast"; 
import axios from "axios"; 
import Loader from "../components/Loader"; 
import { useParams } from "react-router-dom"; 

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]); 
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");

  const { category } = useParams(); 

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}` 
        );
        setPosts(response?.data); 
        setFilteredPosts(response?.data); // Initialize filteredPosts with all posts
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load posts."); 
      }
      setIsLoading(false); 
    };
    fetchPosts();
  }, [category]); 

  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
        />
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(
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

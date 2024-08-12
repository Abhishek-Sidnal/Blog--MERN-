import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Loader from "./Loader";
import axios from "axios";
import toast from "react-hot-toast";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts`
        );
        setPosts(response?.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="p-6 bg-white bg-opacity-80 backdrop-blur-lg min-h-screen w-full ">
      <div className="container mx-auto">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-800">
              No Posts Available at this moment
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;

import React, { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`
        );
        setPosts(response?.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className=" text-primary-text py-8 w-full">
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
            <h2 className="text-xl sm:text-2xl font-semibold">
              No Posts Available at this moment
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorPosts;

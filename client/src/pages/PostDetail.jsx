import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        toast.error("Failed to fetch post details.");
      }
      setIsLoading(false);
    };
    getPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-100 text-gray-900 w-full sm:w-3/4 mx-auto sm:my-10 rounded-lg ">
      {post && (
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />

            {currentUser?.id === post.creator && (
              <div className="flex gap-2 mt-2 sm:mt-0 mb-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="flex items-center justify-center px-4 py-1 text-base text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg shadow-md transition"
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          <div className="mb-6 mt-4 ">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
              alt="Post Thumbnail"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h2>

          <div className="custom-content ">
            <p
              className="break-words"
              dangerouslySetInnerHTML={{ __html: post.description }}
            ></p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;

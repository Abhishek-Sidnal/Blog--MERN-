import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Thumbnail from "../Images/blog14.jpg";
import Loader from "../components/Loader";
import { UserContext, userContext } from "../context/userContext";
import DeletePost from "./DeletePost";
import toast from "react-hot-toast";
import axios from "axios";

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
        toast.error(error);
      }
      setIsLoading(false);
    };
    getPost();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-background text-primary-text py-8 px-4 sm:px-6 lg:px-8 w-full" >
      {post && (
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />

            {currentUser?.id == post?.creator && (
              <div className="flex flex-col sm:flex-row sm:ml-auto space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                <Link
                  to={`/posts/${post?._id}/edit`}
                  className="bg-accent text-background px-4 py-2 rounded-lg hover:bg-secondary-bg transition duration-300"
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h2>

          <div className="mb-6">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
              alt="Post Thumbnail"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose prose-sm sm:prose-base lg:prose-lg mx-auto">
            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import axios from "axios";
import DeletePost from "./DeletePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page for any user who isn't loogged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      console.log("loading");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (err) {
        toast.error(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  console.log(posts[0]);
  return (
    <section className="bg-background text-primary-text py-8 min-h-screen w-full">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-accent">My Dashboard</h1>
        </header>

        {posts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {posts.map((post) => (
              <article
                key={post._id}
                className="bg-secondary-bg p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <img
                    src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h5 className="text-xl font-semibold mb-2">{post.title}</h5>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to={`/posts/${post._id}`}
                      className="flex items-center justify-center px-4 py-1 text-base text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg shadow-md transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/posts/${post._id}/edit`}
                      className="flex items-center justify-center px-4 py-1 text-base text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg shadow-md transition"
                    >
                      Edit
                    </Link>
                      <DeletePost postId={post._id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold">You have no posts yet</h2>
            <p className="text-accent mt-4">
              Start creating new posts to see them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;

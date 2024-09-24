import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  const getAuthors = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error before new request
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL || "http://localhost:4000"}/users/`
      );
      setAuthors(response.data);
    } catch (err) {
      setError("Failed to load authors. Please try again later.");
      toast.error(err.message || "Error fetching authors");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAuthors();
  }, [getAuthors]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-background text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl text-red-500">{error}</h2>
          </div>
        ) : authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map(({ _id: id, avatar, name, posts }) => (
              <Link
                key={id}
                to={`/posts/users/${id}`}
                className="bg-white p-4 rounded-lg flex items-center space-x-4 hover:bg-secondary-text transition duration-300"
              >
                <img
                  src={avatar}
                  alt={`Avatar of ${name}`}
                  className="w-16 h-16 rounded-full border-2 border-accent object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold">{name}</h4>
                  <p className="text-sm text-accent">{posts} Posts</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl text-primary-text">No Authors Found</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Authors;

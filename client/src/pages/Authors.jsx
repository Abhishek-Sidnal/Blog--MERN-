import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For navigation
import toast from "react-hot-toast"; // For error notifications
import axios from "axios"; // For making HTTP requests
import Loader from "../components/Loader"; // Loading spinner component

const Authors = () => {
  const [authors, setAuthors] = useState([]); // State to store authors
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/` // Fetch authors from API
        );
        setAuthors(response.data); // Store authors in state
      } catch (err) {
        toast.error(err.message); // Show error notification
      }
      setIsLoading(false); // Stop loading
    };
    getAuthors();
  }, []); // Fetch authors only once when the component mounts

  if (isLoading) {
    return <Loader />; // Show loading spinner if data is being fetched
  }

  return (
    <section className="bg-white text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map(({ _id: id, avatar, name, posts }) => (
              <Link
                key={id}
                to={`/posts/users/${id}`}
                className="bg-background p-4 rounded-lg flex items-center space-x-4 hover:bg-secondary-text transition duration-300"
              >
                <img
                  src={avatar}
                  alt={`Image of ${name}`}
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
            <h2 className="text-2xl text-primary-text">No Authors</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Authors;

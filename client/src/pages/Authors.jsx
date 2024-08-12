import React, { useEffect, useState } from "react";
import Avatar1 from "../Images/avatar1.jpg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/`
        );
        setAuthors(response.data);
      } catch (err) {
        toast.error(err);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, []);
if(isLoading){
  return <Loader/>
}
  return (
    <section className="bg-background text-primary-text py-8 w-full">
      <div className="container mx-auto px-4">
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map(({ _id: id, avatar, name, posts }) => (
              <Link
                key={id}
                to={`/posts/users/${id}`}
                className="bg-secondary-bg p-4 rounded-lg flex items-center space-x-4 hover:bg-background transition duration-300"
              >
                <img
                  src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
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
            <h2 className="text-2xl">No Authors</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Authors;

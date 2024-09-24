import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-glass-blur backdrop-blur-glass-blur text-primary-text min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-glass-bg p-8 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-6xl font-bold mb-4 text-primary-accent animate-pulse">
          404
        </h1>
        <p className="text-lg mb-6 text-primary-text">
          Oops! The page you're looking for doesn't exist. Please check the URL or return to the homepage.
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-accent text-white py-2 px-6 rounded-lg hover:bg-secondary-accent hover:text-primary-text transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="bg-primary-accent text-white py-2 px-6 rounded-lg hover:bg-secondary-accent hover:text-primary-text transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

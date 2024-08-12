import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-primary-text min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you're looking for doesn't exist.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-secondary-bg text-primary-text py-2 px-4 rounded hover:bg-accent transition duration-300"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="bg-secondary-bg text-primary-text py-2 px-4 rounded hover:bg-accent transition duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

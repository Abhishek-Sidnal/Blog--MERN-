import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

// Add locale for time ago
TimeAgo.addDefaultLocale(en);
TimeAgo.addDefaultLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});
  const [error, setError] = useState(null);

  // Memoize the function to avoid unnecessary re-renders and calls
  const getAuthor = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
      );
      setAuthor(response?.data);
      setError(null);
    } catch (error) {
      setError("Failed to load author details.");
    }
  }, [authorID]);

  useEffect(() => {
    if (authorID) {
      getAuthor();
    }
  }, [authorID, getAuthor]);

  // Fallback UI if author details fail to load
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Link
      to={`/posts/users/${authorID}`}
      className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
    >
      <img
        src={author?.avatar}
        alt={author?.name}
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy" // Lazy-load the avatar image
      />
      <div className="text-sm">
        <h5 className="font-semibold text-gray-800">{author?.name}</h5>
        <small className="text-gray-500">
          <ReactTimeAgo date={new Date(createdAt)} locale="en" />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;

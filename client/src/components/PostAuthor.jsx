import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast/headless";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addDefaultLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        setAuthor(response?.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getAuthor();
  }, [authorID]);

  return (
    <Link
      to={`/posts/users/${authorID}`}
      className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
    >
      <img
        src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`}
        alt={author?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-sm">
        <h5 className="font-semibold text-gray-800">{author.name}</h5>
        <small className="text-gray-500">
          <ReactTimeAgo date={new Date(createdAt)} locale="en-IN" />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;

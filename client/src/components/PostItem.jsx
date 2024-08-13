import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  postID,
  thumbnail,
  category,
  title,
  description,
  authorID,
  createdAt,
}) => {
  const shortDesc =
    description.length > 145 ? description.substr(0, 145) + "..." : description;
  const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;
  const removeExtraSpaceBetweenTags = (html) => {
    // Removes empty paragraphs and trims whitespace between tags

    return html
      .replace(/<p>/g, '<span style="display:inline;">') // Convert <p> to inline
      .replace(/<\/p>/g, "</span>") // Close <span>
      .replace(/<h[1-6]>/g, '<span style="display:inline; font-weight:bold;">') // Convert <h1>-<h6> to inline with bold
      .replace(/<\/h[1-6]>/g, "</span>"); // Close <span>
  };
  return (
    <article className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/posts/${postID}`}>
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>
      <div className="p-4">
        <span className="block text-sm text-gray-500 mb-2">{category}</span>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          <Link to={`/posts/${postID}`} className="hover:text-blue-500">
            {postTitle}
          </Link>
        </h2>
        <p
          className="break-words"
          dangerouslySetInnerHTML={{
            __html: removeExtraSpaceBetweenTags(shortDesc),
          }}
        ></p>
        <div className="flex justify-between items-center mt-3">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link
            to={`/posts/categories/${category}`}
            className="text-sm text-blue-500 hover:underline"
          >
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;

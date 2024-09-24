import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

// Helper function to sanitize and remove extra space
const sanitizeHTML = (html) => {
  return html
    .replace(/<p>/g, '<span style="display:inline;">')
    .replace(/<\/p>/g, "</span>")
    .replace(/<h[1-6]>/g, '<span style="display:inline; font-weight:bold;">')
    .replace(/<\/h[1-6]>/g, "</span>");
};

// Truncate text with a default length
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
};

const PostItem = ({
  postID,
  thumbnail,
  category,
  title,
  description,
  authorID,
  createdAt,
}) => {
  const shortDesc = truncateText(description, 145);
  const postTitle = truncateText(title, 30);

  return (
    <article className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
      <Link to={`/posts/${postID}`}>
        <img
          src={thumbnail}
          alt={`Thumbnail of ${postTitle}`}
          className="w-full h-48 object-cover rounded-t-lg sm:h-64 md:h-48 lg:h-64 xl:h-72"
        />
      </Link>
      <div className="p-4 flex-grow">
        <span className="block text-sm text-gray-500 mb-2">{category}</span>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          <Link to={`/posts/${postID}`} className="hover:text-blue-500">
            {postTitle}
          </Link>
        </h2>
        <p
          className="break-words"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(shortDesc),
          }}
        ></p>
      </div>
      <div className="p-4 flex justify-between items-center mt-auto">
        <PostAuthor authorID={authorID} createdAt={createdAt} />
        <Link
          to={`/posts/categories/${category}`}
          className="text-sm text-blue-500 hover:underline"
        >
          {category}
        </Link>
      </div>
    </article>
  );
};

export default PostItem;

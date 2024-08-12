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

  return (
    <article>
      <img
        src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
        alt={title}
      />
      <div>
        <span>
          {category}
        </span>
        <h2>
          <Link to={`/posts/${postID}`}>
            {postTitle}
          </Link>
        </h2>
        <p
          dangerouslySetInnerHTML={{ __html: shortDesc }}
        ></p>
        <div>
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link
            to={`/posts/categories/${category}`}
          >
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;

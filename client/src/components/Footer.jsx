import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white bg-opacity-80 backdrop-blur-lg text-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center space-x-4 mb-4">
          <li>
            <Link
              to="posts/categories/Agriculture"
              className="hover:text-blue-600"
            >
              Agriculture
            </Link>
          </li>
          <li>
            <Link
              to="posts/categories/Business"
              className="hover:text-blue-600"
            >
              Business
            </Link>
          </li>
          <li>
            <Link
              to="posts/categories/Education"
              className="hover:text-blue-600"
            >
              Education
            </Link>
          </li>
          <li>
            <Link
              to="posts/categories/Entertainment"
              className="hover:text-blue-600"
            >
              Entertainment
            </Link>
          </li>
          <li>
            <Link to="posts/categories/Art" className="hover:text-blue-600">
              Art
            </Link>
          </li>
          <li>
            <Link
              to="posts/categories/Investment"
              className="hover:text-blue-600"
            >
              Investment
            </Link>
          </li>
          <li>
            <Link
              to="posts/categories/Uncategorized"
              className="hover:text-blue-600"
            >
              Uncategorized
            </Link>
          </li>
          <li>
            <Link to="posts/categories/Weather" className="hover:text-blue-600">
              Weather
            </Link>
          </li>
        </ul>
        <div className="text-center">
          <small>
            &copy; {new Date().getFullYear()} My Blog's. All Rights Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

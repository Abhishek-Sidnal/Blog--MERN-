import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background text-primary-text py-6">
      <div className="container mx-auto px-4">
        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center space-x-4 mb-4">
          <li>
            <Link to="posts/categories/Agriculture" className="hover:text-accent">Agriculture</Link>
          </li>
          <li>
            <Link to="posts/categories/Business" className="hover:text-accent">Business</Link>
          </li>
          <li>
            <Link to="posts/categories/Education" className="hover:text-accent">Education</Link>
          </li>
          <li>
            <Link to="posts/categories/Entertainment" className="hover:text-accent">Entertainment</Link>
          </li>
          <li>
            <Link to="posts/categories/Art" className="hover:text-accent">Art</Link>
          </li>
          <li>
            <Link to="posts/categories/Investment" className="hover:text-accent">Investment</Link>
          </li>
          <li>
            <Link to="posts/categories/Uncategorized" className="hover:text-accent">Uncategorized</Link>
          </li>
          <li>
            <Link to="posts/categories/Weather" className="hover:text-accent">Weather</Link>
          </li>
        </ul>

        {/* Copyright Information */}
        <div className="text-center">
          <small>&copy; {new Date().getFullYear()} CodingShala. All Rights Reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

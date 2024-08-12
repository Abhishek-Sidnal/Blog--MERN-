import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../Images/avatar1.jpg";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  const { currentUser } = useContext(UserContext);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="bg-gray-900 shadow-lg">
      <div className="flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
          />
          <span className="ml-2 text-lg lg:text-xl font-semibold text-gray-200">
            My Blog
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex space-x-4">
          {currentUser?.id && (
            <>
              <Link
                to={`/profile/${currentUser?.id}`}
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                {currentUser?.name}
              </Link>
              <Link
                to="/create"
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                Create Post
              </Link>
              <Link
                to="/authors"
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                Authors
              </Link>

              <Link
                to="/logout"
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                Logout
              </Link>
            </>
          )}
          {!currentUser?.id && (
            <>
              <Link
                to="/authors"
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                Authors
              </Link>

              <Link
                to="/login"
                className="text-lg text-gray-200 hover:text-blue-500"
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Hamburger Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-200 text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-end bg-gray-900 bg-opacity-75 z-50">
          <div ref={sidebarRef} className="w-64 bg-gray-800 p-4 space-y-4">
            <button onClick={toggleMenu} className="text-gray-200 text-2xl">
              <FaTimes />
            </button>
            <nav className="flex flex-col space-y-4">
              {currentUser?.id && (
                <>
                  <Link
                    to={`/profile/${currentUser?.id}`}
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    {currentUser?.name}
                  </Link>
                  <Link
                    to="/create"
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Create Post
                  </Link>
                  <Link
                    to="/authors"
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Authors
                  </Link>
                  <Link
                    to="/logout"
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Logout
                  </Link>
                </>
              )}
              {!currentUser?.id && (
                <>
                  <Link
                    to="/authors"
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Authors
                  </Link>
                  <Link
                    to="/login"
                    className="text-lg text-gray-200 hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

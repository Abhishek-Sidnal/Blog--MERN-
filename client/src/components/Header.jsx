import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBlog, FaTimes } from "react-icons/fa";
import { UserContext } from "../context/UserContext";

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
    <header className="sticky top-0 z-50 bg-glass-bg shadow-lg">
      <div className="flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <FaBlog className="text-primary-accent text-2xl lg:text-3xl" />
          <span className="ml-3 text-lg lg:text-xl font-semibold text-primary-text">
            My Blog's
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex space-x-4">
          {currentUser?.id && (
            <>
              <Link
                to={`/profile/${currentUser?.id}`}
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                {currentUser?.name}
              </Link>
              <Link
                to="/create"
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                Create Post
              </Link>
              <Link
                to="/authors"
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                Authors
              </Link>
              <Link
                to="/logout"
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                Logout
              </Link>
            </>
          )}
          {!currentUser?.id && (
            <>
              <Link
                to="/authors"
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                Authors
              </Link>
              <Link
                to="/login"
                className="text-lg text-primary-text hover:text-primary-accent"
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Hamburger Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-primary-text text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-end bg-glass-bg bg-opacity-75 z-50 backdrop-blur-glass-blur">
          <div ref={sidebarRef} className="w-64 bg-grid-item-bg p-4 space-y-4">
            <button onClick={toggleMenu} className="text-primary-text text-2xl">
              <FaTimes />
            </button>
            <nav className="flex flex-col space-y-4">
              {currentUser?.id && (
                <>
                  <Link
                    to={`/profile/${currentUser?.id}`}
                    className="text-lg text-primary-text hover:text-primary-accent"
                    onClick={toggleMenu}
                  >
                    {currentUser?.name}
                  </Link>
                  <Link
                    to="/create"
                    className="text-lg text-primary-text hover:text-primary-accent"
                    onClick={toggleMenu}
                  >
                    Create Post
                  </Link>
                  <Link
                    to="/authors"
                    className="text-lg text-primary-text hover:text-primary-accent"
                    onClick={toggleMenu}
                  >
                    Authors
                  </Link>
                  <Link
                    to="/logout"
                    className="text-lg text-primary-text hover:text-primary-accent"
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
                    className="text-lg text-primary-text hover:text-primary-accent"
                    onClick={toggleMenu}
                  >
                    Authors
                  </Link>
                  <Link
                    to="/login"
                    className="text-lg text-primary-text hover:text-primary-accent"
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

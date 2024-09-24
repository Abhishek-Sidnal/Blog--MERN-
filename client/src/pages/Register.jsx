import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Ensure password length is at least 6 characters
    return password.length >= 6;
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const { name, email, password, password2 } = userData;

    if (!name || !email || !password || !password2) {
      toast.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password should be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = response.data;
      if (newUser) {
        toast.success(
          `Registration successful! A verification email has been sent to ${email}.`
        );
        navigate("/login");
      } else {
        toast.error("Couldn't register user. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      if (error.response?.status === 422) {
        toast.error("Validation error: " + errorMessage);
      } else if (error.response?.status === 500) {
        toast.error("Server error: " + errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center p-6">
      <div className="bg-secondary-bg p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold mb-8 text-center">Sign Up</h2>
        <form className="space-y-5" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            autoFocus
            required
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            required
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold w-full flex justify-center items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <small className="block text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent hover:text-primary-text font-semibold"
          >
            Sign In
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;

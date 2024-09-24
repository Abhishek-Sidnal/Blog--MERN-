import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/login`,
        userData
      );
      const user = response.data;
      setCurrentUser(user);
      toast.success(`Welcome back, ${userData.email}!`);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center p-6">
      <div className="bg-secondary-bg p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-accent">Sign In</h2>
        <form className="space-y-4" onSubmit={loginUser}>
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold w-full flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <small className="block text-center mt-4">
          Forgot your password?{" "}
          <Link
            to="/forgot-password"
            className="text-accent hover:text-primary-text transition duration-300"
          >
            Reset Password
          </Link>
        </small>
        <small className="block text-center mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-accent hover:text-primary-text transition duration-300"
          >
            Sign Up
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;

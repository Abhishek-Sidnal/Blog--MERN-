import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/users/forgot-password`, { email });
      toast.success("Password reset link has been sent to your email.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center p-6">
      <div className="bg-glass-bg p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-glass-blur">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-accent">
          Forgot Password
        </h2>
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
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
                Sending...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <small className="block text-center mt-4">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-primary-accent hover:text-primary-text transition duration-300"
          >
            Sign In
          </Link>
        </small>
      </div>
    </section>
  );
};

export default ForgotPassword;

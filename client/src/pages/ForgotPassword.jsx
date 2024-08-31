import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center p-6">
      <div className="bg-secondary-bg p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-accent">
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
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold  w-full"
          >
            Reset Password
          </button>
        </form>
        <small className="block text-center mt-4">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-accent hover:text-primary-text transition duration-300"
          >
            Sign In
          </Link>
        </small>
      </div>
    </section>
  );
};

export default ForgotPassword;

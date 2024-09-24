import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/reset-password/${token}`,
        formData
      );
      toast.success("Password has been reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center p-6">
      <div className="bg-secondary-bg p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-accent">
          Reset Password
        </h2>
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
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
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;

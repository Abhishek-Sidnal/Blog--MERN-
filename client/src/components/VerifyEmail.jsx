import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Memoize the email verification function to avoid unnecessary re-creations
  const verifyEmail = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/verify-email/${token}`
      );
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Email verification failed.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after a delay
      }, 3000); // Redirect after 3 seconds
    }
  }, [token, navigate]);

  // Trigger the email verification when the component mounts
  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {isLoading ? (
          <div className="text-xl font-semibold text-primary-text">
            Verifying your email...
          </div>
        ) : (
          <div className="text-xl font-semibold text-primary-text">
            {message}
          </div>
        )}
        {!isLoading && (
          <p className="text-gray-500 mt-4">You will be redirected shortly...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/verify-email/${token}`
        );
        setMessage(response.data.message);
        toast.success(response.data.message);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Email verification failed."
        );
        toast.error(
          error.response?.data?.message || "Email verification failed."
        );
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after a delay
        }, 3000); // Redirect after 3 seconds
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {isLoading ? <div>Verifying your email...</div> : <div>{message}</div>}
        {!isLoading && (
          <p className="text-gray-500 mt-4">
            You will be redirected shortly...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

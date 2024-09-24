import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(null);
    toast.success("Logged Out!", {
      duration: 1500, 
    });

    const timeoutId = setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [navigate, setCurrentUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
    </div>
  );
};

export default Logout;

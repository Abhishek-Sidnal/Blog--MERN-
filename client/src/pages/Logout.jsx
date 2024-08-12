import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(null);
    toast.success("Logged Out!");

    // Delay navigation to allow toast to be seen
    setTimeout(() => {
      navigate("/login");
    }, 1000); // Delay in milliseconds
  }, []);

  return null;
};

export default Logout;

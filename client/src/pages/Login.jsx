import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  // State to manage user input data
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  // State to manage error messages (if any)
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Access the context to set the current user after login
  const { setCurrentUser } = useContext(UserContext);

  // Handler to update state on input change
  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handler to manage login form submission
  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Send POST request to login endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/login`,
        userData
      );
      const user = await response.data;

      // Set the current user in the context
      setCurrentUser(user);

      // Show success toast and navigate to home page
      toast.success(`${userData.email} Logged In`);
      navigate("/");
    } catch (error) {
      // Show error toast if login fails
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center w-full">
      <div className="bg-secondary-bg p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={loginUser}>
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
          />

          <button
            type="submit"
            className="w-full bg-accent text-background p-3 rounded-lg hover:bg-secondary-bg transition duration-300"
          >
            Sign In
          </button>
        </form>
        <small className="block text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:text-primary-text">
            Sign Up
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;

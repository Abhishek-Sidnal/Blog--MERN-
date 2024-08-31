import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

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

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic client-side validation
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.password2
    ) {
      toast.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (userData.password !== userData.password2) {
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
      if (!newUser) {
        toast.error("Couldn't register user. Please try again.");
      } else {
        toast.success(
          `Registration successful! A verification email has been sent to ${userData.email}.`
        );
        navigate("/login");
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
  if (isLoading) {
    return <Loader />;
  }

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
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
            className="w-full p-4 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold  w-full"
          >
            Register
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

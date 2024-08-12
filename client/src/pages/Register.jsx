import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = await response.data;
      if (!newUser) {
        setError("Couldn't register user. Please try again.");
      } else {
        toast.success(`${userData.name} Registered`);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

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

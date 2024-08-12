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
      console.log(newUser);
      if (!newUser) {
        setError("Coludn't register user. Please try again. ");
      }
      toast.success(`${userData.name} Registered`);

      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <section className="bg-background text-primary-text min-h-screen flex items-center justify-center w-full">
      <div className="bg-accent p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={registerUser}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
            className="w-full p-3 rounded-lg bg-background border border-accent text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full bg-accent text-background p-3 rounded-lg hover:bg-secondary-bg transition duration-300"
          >
            Register
          </button>
        </form>
        <small className="block text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-primary-text">
            Sign In
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;

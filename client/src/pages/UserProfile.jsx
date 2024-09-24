import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [errors, setErrors] = useState({}); // State for form validation errors

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const { id } = useParams();
  const navigate = useNavigate();

  // Redirect to login page if the user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, avatar } = response.data;
        setAvatar(avatar);
        setName(name);
        setEmail(email);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };
    getUser();
  }, [id, token]);

  const handleAvatarChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file); // Store the file object for upload

      // Create a local URL for preview
      const filePreviewURL = URL.createObjectURL(file);
      setAvatarPreview(filePreviewURL); // Use this for preview in img src

      // Cleanup the preview URL to prevent memory leak
      return () => URL.revokeObjectURL(filePreviewURL);
    }
  }, []);

  const changeAvatarHandler = useCallback(async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);

      const response = await axios.post(
        `${BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvatar(response?.data.avatar);
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Avatar update failed.");
    }
  }, [avatar, token]);

  const validateForm = () => {
    const validationErrors = {};
    if (!name) validationErrors.name = "Name is required.";
    if (!email) validationErrors.email = "Email is required.";
    if (!currentPassword) validationErrors.currentPassword = "Current password is required.";
    if (!newPassword) validationErrors.newPassword = "New password is required.";
    if (newPassword !== newConfirmPassword) validationErrors.newConfirmPassword = "Passwords do not match.";
    return validationErrors;
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false); // Stop loading when validation fails
      return;
    }

    try {
      const userData = {
        name,
        email,
        currentPassword,
        newPassword,
        newConfirmPassword,
      };

      const response = await axios.patch(
        `${BASE_URL}/users/edit-user`,
        userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Details updated");
        navigate("/"); // Redirect to home or user profile
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update details.");
    } finally {
      setIsLoading(false); // Ensure loading stops in all cases
    }
  };

  return (
    <section className="w-full max-w-lg my-8 p-4 mx-auto bg-white rounded-xl shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <Link
          to={`/myposts/${currentUser?.id}`}
          className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          My posts
        </Link>
        <div className="relative flex flex-col items-center">
          <div className="relative rounded-full overflow-hidden w-32 h-32 sm:w-40 sm:h-40">
            <img
              src={avatarPreview || avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <form className="absolute right-2 bottom-2 flex flex-col items-center">
            <input
              className="hidden"
              type="file"
              name="avatar"
              id="avatar"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleAvatarChange}
            />
            <label
              onClick={() => setIsAvatarTouched(true)}
              className="bg-blue-700 text-white absolute right-1 bottom-0 rounded-full size-8 grid place-items-center"
              htmlFor="avatar"
            >
              <FaEdit size={16} />
            </label>
            {isAvatarTouched && (
              <button
                onClick={changeAvatarHandler}
                className="bg-blue-700 text-white absolute right-1 bottom-0 rounded-full size-8 grid place-items-center"
              >
                <FaCheck size={16} />
              </button>
            )}
          </form>
        </div>
        <h1 className="font-bold text-xl">{currentUser.name}</h1>
        <form
          onSubmit={updateUserDetails}
          className="w-full flex flex-col gap-4"
        >
          <div>
            <input
              className={`w-full px-4  py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.currentPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
          </div>
          <div>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.newPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>
          <div>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.newConfirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              type="password"
              placeholder="Confirm new password"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />
            {errors.newConfirmPassword && <p className="text-red-500 text-sm">{errors.newConfirmPassword}</p>}
          </div>
          <button
            className={`w-full px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold self-center flex justify-center items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
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
            ) : (
              "Update Details"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UserProfile;

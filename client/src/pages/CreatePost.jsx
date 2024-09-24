import React, { useContext, useEffect, useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const POST_CATEGORIES = [
  "Agriculture",
  "Business",
  "Education",
  "Entertainment",
  "Art",
  "Investment",
  "Uncategorized",
  "Weather",
]; // Define POST_CATEGORIES array here

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ],
    []
  );

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!category) {
      toast.error("Category is required");
      return false;
    }
    if (!thumbnail) {
      toast.error("Thumbnail is required");
      return false;
    }
    return true;
  };

  const createPost = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);

    const postData = new FormData();
    postData.append("title", title);
    postData.append("category", category);
    postData.append("description", description);
    postData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success(`${title} posted successfully.`);
        navigate("/"); // Redirect on success
      }
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-background text-primary-text">
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-2xl sm:text-3xl">Create Post</h2>

        <form
          className="flex flex-col gap-6"
          onSubmit={createPost}
          encType="multipart/form-data"
        >
          <input
            className="px-4 py-2 border border-secondary-text rounded-lg bg-secondary-text text-background focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            className="px-4 py-2 border border-secondary-text rounded-lg bg-secondary-text text-background focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ReactQuill
            className="bg-secondary-text h-64 overflow-auto border border-secondary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            modules={quillModules}
            formats={quillFormats}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            className="border border-secondary-text px-4 py-2 rounded-lg bg-secondary-text text-background focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/jpg, image/png, image/jpeg"
          />
          <button
            className={`px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold self-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
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
                Creating Post...
              </div>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;

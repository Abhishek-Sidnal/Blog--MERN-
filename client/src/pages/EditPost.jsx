import React, { useContext, useEffect, useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const modules = useMemo(
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

  const formats = useMemo(
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

  const POST_CATEGORIES = useMemo(
    () => [
      "Agriculture",
      "Business",
      "Education",
      "Entertainment",
      "Art",
      "Investment",
      "Uncategorized",
      "Weather",
    ],
    []
  );

  useEffect(() => {
    const getPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setTitle(response.data.title);
        setCategory(response.data.category);
        setDescription(response.data.description);
      } catch (err) {
        setError("Failed to fetch the post.");
        toast.error("Failed to fetch the post.");
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true); 

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    if (thumbnail) {
      postData.set("thumbnail", thumbnail);
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success(`${title} updated successfully.`);
        navigate("/"); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-6 px-4 sm:px-6 lg:px-8 bg-background text-primary-text">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-accent">Edit Post</h2>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <form
          className="flex flex-col gap-6"
          onSubmit={editPost}
          encType="multipart/form-data"
        >
          <input
            className="px-4 py-2 border border-secondary-text rounded-lg bg-secondary-text text-background focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
            modules={modules}
            formats={formats}
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
                Updating...
              </div>
            ) : (
              "Update Post"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;

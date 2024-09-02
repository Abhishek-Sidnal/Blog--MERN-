import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["code-block"], // Add code block option here
      ["clean"],
    ],
  };

  const formats = [
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
    "code-block", // Add code block format here
  ];

  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Uncategorized",
    "Weather",
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setTitle(response.data.title);
        setCategory(response.data.category);
        setDescription(response.data.description);
      } catch (err) {
        toast.error("Failed to fetch the post.");
      } finally {
        setIsLoading(false); // End loading
      }
    };
    getPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();

    // If the form is already being submitted, return early
    if (isLoading) return;

    setIsLoading(true); // Start loading

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

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
      setIsLoading(false); // End loading
    }
  };

  if (isLoading) {
    return <Loader />; // Show loader during loading state
  }

  return (
    <section className="w-full max-w-3xl mx-auto my-6 px-4 sm:px-6 lg:px-8 bg-background text-primary-text">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-accent">Edit Post</h2>
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
            className={`px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold self-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading} // Disable button during loading
          >
            Update Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;

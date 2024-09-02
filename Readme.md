# 🖥️ MERN Stack Blog Application

This is a fully functional blog application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The app supports user authentication, post creation, editing, and deletion, along with various other features like category-based post filtering, author-specific post views, and much more.

## 🚀 Features

- **Responsive Design**: Fully responsive layout for a seamless experience across all devices.
- **Authentication**: Secure JWT-based user authentication.
- **User Profiles**: Users can view and update their profiles, including uploading avatars.
- **CRUD Operations**: Create, read, update, and delete posts with ease.
- **Categories and Authors**: Filter posts by category or view all posts by a specific author.
- **Cloudinary Integration**: Images are stored securely in Cloudinary.
- **Real-time Notifications**: Error handling and success messages are displayed using react-hot-toast.
- **Password Reset**: Users can reset their passwords via email.

## 🛠️ Technologies Used

- **Frontend**: React.js, Tailwind CSS, React Router, React Quill
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Image Storage**: Cloudinary
- **Notifications**: react-hot-toast
- **Deployment**: Render

## 🧑‍💻 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (or yarn)
- MongoDB

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Abhishek-Sidnal/Blog--MERN-.git
    cd mern-blog-app
    ```

2. **Install dependencies for both the frontend and backend:**

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the `server` directory with the following:

    ```bash
    MONGO_URI=<Your MongoDB URI>
    PORT=5000
    JWT_SECRET=<Your JWT Secret>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    ```

4. **Run the application:**

    ```bash
    cd server
    npm run dev
    ```
    ```bash
    cd client
    npm start
    ```

    This will start both the frontend and backend servers.

### Usage

- **Register and Login**: Create a new account or login with an existing one.
- **Create Posts**: Navigate to the "Create Post" section to start writing your blog posts.
- **Manage Posts**: Edit or delete your posts from the dashboard.
- **Explore**: Browse posts by category or author.

## ✨ Demo

Check out the live demo: [https://frontend-75cg.onrender.com/](#)

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.

## 📫 Contact

If you have any questions or suggestions, feel free to reach out:

[![Email](https://img.shields.io/badge/Email-apsidnal@gmail.com-red?style=flat&logo=gmail&logoColor=white)](mailto:apsidnal@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Abhishek--Sidnal-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/abhishek-sidnal/)
[![GitHub](https://img.shields.io/badge/GitHub-Abhishek--Sidnal-lightgrey?style=flat&logo=github)](https://github.com/Abhishek-Sidnal/)
[![Instagram](https://img.shields.io/badge/Instagram-apsidnal-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/apsidnal/)
[![X](https://img.shields.io/badge/X-apsidnal-1DA1F2?style=flat&logo=x&logoColor=white)](https://x.com/apsidnal)

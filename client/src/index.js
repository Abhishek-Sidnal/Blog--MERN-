import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import CategoryPosts from './pages/CategoryPosts';
import AuthorPosts from './pages/AuthorPosts';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import Logout from './pages/Logout';
import { Toaster } from 'react-hot-toast';
import UserProvider from './context/userContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import axios from 'axios';

// Configure axios baseURL globally
axios.defaults.baseURL = 'https://frontend-75cg.onrender.com';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "verify-email/:token", element: <VerifyEmail /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

function reloadWebsite() {
  axios.get('/')
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

function App() {
  useEffect(() => {
    const interval = setInterval(reloadWebsite, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

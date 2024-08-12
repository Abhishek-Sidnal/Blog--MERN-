import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="text-gray-800 min-h-screen flex flex-col bg-gradient-to-r from-blue-100 to-purple-100">
      <Header />
      <main className=" flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

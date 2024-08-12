import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className=" text-primary-text min-h-screen flex flex-col">
      <Header />
      <main className=" h-full w-full flex items-center justify-center flex-1 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

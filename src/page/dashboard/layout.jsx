import React from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex w-full min-h-screen">
      {/* partisi sidebar */}
      <div className="hidden lg:flex lg:flex-[1] lg:p-2 ">
        <div className="bg-purple-500 h-[calc(100vh-16px)] rounded-lg fixed w-[20%] px-8 py-5 gap-4 flex flex-col">
          <Sidebar />
        </div>
      </div>

      {/* partisi nabar dan konten web */}
      <div className="flex-[4] px-4">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

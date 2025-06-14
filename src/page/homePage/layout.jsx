import React from "react";
import Headers from "../../components/header";
import Footer from "../../components/footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col max-h-max">
      <Headers />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;

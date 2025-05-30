import React, { useState } from "react";
import Search from "./search";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import { GrFormNext } from "react-icons/gr";
import { TfiMenu } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./sidebar";

const formatPathName = (str) => {
  if (!str) return "";
  if (!isNaN(str)) return `User ${str}`; // bisa custom lagi kalau mau
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function Navbar() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x); // hapus string kosong dari root
  const [toggleMenu, setTogleMenu] = useState(false);
  const [toggleSearch, setTogleSearch] = useState(false);

  return (
    <div className="h-13 bg-purple-500 mt-2 rounded-2xl flex items-center px-3 relative">
      {toggleMenu && (
        <div className="absolute top-0 left-0 z-20 w-full h-max bg-purple-500 p-5 rounded-2xl flex flex-col gap-4  lg:hidden">
          <button onClick={() => setTogleMenu((prev) => !prev)} className="text-white text-[32px]">
            <IoMdClose />
          </button>
          <Sidebar />
        </div>
      )}
      <div className="w-full flex justify-between items-center text-white">
        <button onClick={() => setTogleMenu((prev) => !prev)} className="lg:hidden">
          <TfiMenu />
        </button>
        <div className="flex gap-2">
          <Link to="/dashboard" className="hover:underline font-semibold text-[12px] lg:text-[16px]">
            Dashboard
          </Link>

          {pathnames.slice(1).map((value, index) => {
            const to = `/dashboard/${pathnames.slice(1, index + 2).join("/")}`;
            const isLast = index === pathnames.slice(1).length - 1;

            return (
              <div key={index} className="flex items-center gap-1">
                <GrFormNext className="text-sm" />
                {isLast ? (
                  <span className="font-semibold text-[12px] lg:text-[16px]">{formatPathName(value)}</span>
                ) : (
                  <Link to={to} className="hover:underline text-[12px] lg:text-[16px]">
                    {formatPathName(value)}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 items-center ">
          <button onClick={() => setTogleSearch((prev) => !prev)} className="sm:hidden">
            <MdSearch />
          </button>
          <div className="hidden sm:flex">
            <Search />
          </div>
          {toggleSearch && (
            <div className="p-2 bg-purple-500 rounded-2xl absolute z-30 right-0 top-16 sm:hidden">
              <Search />
            </div>
          )}
          <MdNotifications />
          <MdOutlineChat />
          <MdPublic />
        </div>
      </div>
    </div>
  );
}

export default Navbar;

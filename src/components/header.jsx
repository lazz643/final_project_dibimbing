import React from "react";
import { useNavigate } from "react-router-dom";

function Headers() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-[52px] bg-white flex justify-between items-center px-96 sticky top-0 z-10">
        <div>logo</div>
        <ul className="flex gap-8">
          <li>
            <button>Home</button>
          </li>
          <li>
            <button>Banner</button>
          </li>
          <li>
            <button>Activities</button>
          </li>
          <li>
            <button>Promo</button>
          </li>
        </ul>
        <div className="flex gap-1.5">
          <button className="px-4 h-8 bg-white border-1 border-gray-200 rounded-full" onClick={() => navigate("/login", { state: { from: "login" } })}>
            Login
          </button>
          <button className="px-4 h-8 bg-[#28cdba] border-none rounded-full text-white" onClick={() => navigate("/login", { state: { from: "regis" } })}>
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default Headers;

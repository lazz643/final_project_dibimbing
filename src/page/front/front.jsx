import React, { useState, useEffect } from "react";
import Login from "../../components/login";
import Regis from "../../components/regis";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function Front() {
  const [menu, setMenu] = useState("login");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.from === "regis") {
      setMenu("regis");
    } else {
      setMenu("login");
    }
  }, [location.state]);

  const toggleMenu = () => {
    setMenu((prev) => (prev === "login" ? "regis" : "login"));
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-screen relative">
      <div className="w-full h-screen absolute z-10 top-0 left-0 flex">
        <div className="hidden lg:flex-1 lg:flex bg-[#28cdba]">
          <img src="/front.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-screen flex-1 flex flex-col gap-2 items-center justify-center">
          {/* Tombol Back */}
          <div className="flex justify-start w-full sm:w-[450px]">
            <button onClick={handleBack} className=" z-20 flex items-center gap-1 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-[#28cdba]">
              <IoArrowBack className="text-lg" />
              <span>Kembali</span>
            </button>
          </div>

          <div className="w-full shadow-xl h-full bg-gray-100 flex flex-col gap-3 p-5 justify-center overflow-y-auto sm:w-[450px] sm:h-auto sm:max-h-[90vh] sm:rounded-xl">
            <div className="w-full flex justify-between mb-5">
              <button onClick={() => setMenu("login")} className={`w-[45%] py-1 border-2  rounded-2xl  cursor-pointer text-sm ${menu === "login" ? "border-gray-300 text-gray-300 font-medium" : "border-[#28cdba] text-[#28cdba]"}`}>
                Login
              </button>
              <button onClick={() => setMenu("regis")} className={`w-[45%] py-1 border-2  rounded-2xl  cursor-pointer text-sm ${menu === "regis" ? "border-gray-300 text-gray-300 font-medium" : "border-[#28cdba] text-[#28cdba]"}`}>
                Register
              </button>
            </div>
            {menu === "login" ? <Login /> : <Regis menu={toggleMenu} />}
            {menu === "login" ? (
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <span className="text-blue-500 underline cursor-pointer" onClick={toggleMenu}>
                  Register
                </span>
              </p>
            ) : (
              <p className="text-center text-sm">
                Already have an account?{" "}
                <span className="text-blue-500 underline cursor-pointer" onClick={toggleMenu}>
                  Login
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Front;

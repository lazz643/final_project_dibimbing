import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart, FaReceipt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";

function Headers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    profilePictureUrl: "",
    role: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const accountMenuRef = useRef(null);

  // Cek status login dan data user dari localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("userData");

    if (token) {
      setIsLoggedIn(true);
      fetchCartItemCount();

      if (userDataStr) {
        try {
          const parsedUserData = JSON.parse(userDataStr);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItemCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Fetch cart item count
  const fetchCartItemCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      const cartItems = response.data.data || [];
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Helper function to check if current path is active
  const isActiveRoute = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Get active menu class
  const getMenuClass = (path, baseClass) => {
    const activeClass = isActiveRoute(path) ? "text-[#28cdba] bg-[#28cdba]/10 px-3 py-1 rounded-full" : "hover:text-[#28cdba]";
    return `${baseClass} ${activeClass}`;
  };

  // Get mobile menu class
  const getMobileMenuClass = (path, baseClass) => {
    const activeClass = isActiveRoute(path) ? "bg-[#28cdba]/10 text-[#28cdba] border-r-2 border-[#28cdba]" : "hover:bg-gray-100";
    return `${baseClass} ${activeClass}`;
  };

  // Tutup dropdown menu ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData({
      name: "",
      profilePictureUrl: "",
      role: "",
    });
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  return (
    <>
      <div className="w-full h-[60px] bg-white flex justify-between items-center px-4 md:px-8 lg:px-16 xl:px-24 sticky top-0 z-10 shadow-sm">
        {/* Logo */}
        <div className="text-xl font-bold text-[#28cdba] cursor-pointer" onClick={() => navigate("/")}>
          TravelJoy
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 lg:gap-8">
          <li>
            <button onClick={() => navigate("/")} className={getMenuClass("/", "transition-colors duration-300 font-medium")}>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/category")} className={getMenuClass("/category", "transition-colors duration-300 font-medium")}>
              Category
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/activity")} className={getMenuClass("/activity", "transition-colors duration-300 font-medium")}>
              Activities
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/promo")} className={getMenuClass("/promo", "transition-colors duration-300 font-medium")}>
              Promo
            </button>
          </li>
        </ul>

        <div className="hidden md:flex gap-2 items-center">
          {isLoggedIn && (
            <button
              onClick={() => navigate("/cart")}
              className={`p-2 transition-colors duration-300 relative ${isActiveRoute("/cart") ? "text-[#28cdba] bg-[#28cdba]/10 rounded-lg" : "text-gray-600 hover:text-[#28cdba]"}`}
              title="Shopping Cart"
            >
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount > 99 ? "99+" : cartItemCount}</span>}
            </button>
          )}

          {!isLoggedIn ? (
            <>
              <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-300 text-sm font-medium" onClick={() => navigate("/login", { state: { from: "login" } })}>
                Login
              </button>
              <button className="px-4 py-1.5 bg-[#28cdba] border-none rounded-full text-white hover:bg-[#25b9a8] transition-colors duration-300 text-sm font-medium" onClick={() => navigate("/login", { state: { from: "regis" } })}>
                Register
              </button>
            </>
          ) : (
            <div className="relative" ref={accountMenuRef}>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-[#25b9a8] transition-colors duration-300 text-sm font-medium" onClick={toggleAccountMenu}>
                {userData.profilePictureUrl ? (
                  <img src={userData.profilePictureUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#28cdba] flex items-center justify-center text-white text-xs">{userData.name ? userData.name.charAt(0).toUpperCase() : "U"}</div>
                )}
                <span>{userData.name || "Akun"}</span>
                <IoMdArrowDropdown className={`transition-transform duration-300 ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Edit Akun
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      navigate("/transaction");
                    }}
                  >
                    Riwayat Transaksi
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 bg-white z-20 shadow-md">
          <ul className="flex flex-col py-2">
            <li>
              <button
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className={getMobileMenuClass("/", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/category");
                  setMobileMenuOpen(false);
                }}
                className={getMobileMenuClass("/category", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium")}
              >
                Category
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/activity");
                  setMobileMenuOpen(false);
                }}
                className={getMobileMenuClass("/activity", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium")}
              >
                Activities
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/promo");
                  setMobileMenuOpen(false);
                }}
                className={getMobileMenuClass("/promo", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium")}
              >
                Promo
              </button>
            </li>

            {/* Cart Button for Mobile */}
            {isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className={getMobileMenuClass("/cart", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium flex items-center gap-2")}
                >
                  <FaShoppingCart size={16} />
                  Shopping Cart
                  {cartItemCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">{cartItemCount > 99 ? "99+" : cartItemCount}</span>}
                </button>
              </li>
            )}

            {/* Login/Register atau Account di Mobile */}
            {!isLoggedIn ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/login", { state: { from: "login" } });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-300 font-medium text-[#28cdba]"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/login", { state: { from: "regis" } });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-300 font-medium text-[#28cdba]"
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    {userData.profilePictureUrl ? (
                      <img src={userData.profilePictureUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#28cdba] flex items-center justify-center text-white">{userData.name ? userData.name.charAt(0).toUpperCase() : "U"}</div>
                    )}
                    <div>
                      <div className="font-medium">{userData.name || "User"}</div>
                      <div className="text-xs text-gray-500">{userData.role || ""}</div>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-300 font-medium"
                  >
                    Edit Akun
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/transaction");
                      setMobileMenuOpen(false);
                    }}
                    className={getMobileMenuClass("/transaction", "w-full text-left px-4 py-3 transition-colors duration-300 font-medium flex items-center gap-2")}
                  >
                    Riwayat Transaksi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-300 font-medium text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Headers;

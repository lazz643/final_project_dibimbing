import React from "react";
import { MdDashboard, MdSupervisedUserCircle, MdShoppingBag, MdAttachMoney, MdWork, MdAnalytics, MdPeople, MdOutlineSettings, MdHelpCenter, MdLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Products",
          path: "/dashboard/products",
          icon: <MdShoppingBag />,
        },
        {
          title: "Transactions",
          path: "/dashboard/transactions",
          icon: <MdAttachMoney />,
        },
      ],
    },
    {
      title: "Analytics",
      list: [
        {
          title: "Revenue",
          path: "/dashboard/revenue",
          icon: <MdWork />,
        },
        {
          title: "Reports",
          path: "/dashboard/reports",
          icon: <MdAnalytics />,
        },
        {
          title: "Teams",
          path: "/dashboard/teams",
          icon: <MdPeople />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <div className="w-12 aspect-square rounded-full overflow-hidden bg-gray-200">
          <img
            src="https://static.vecteezy.com/system/resources/previews/030/504/837/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white flex flex-col justify-center">
          <p className="text-[14px] font-bold">Jhon Doe</p>
          <p className="text-[12px]">Admin</p>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {menuItems.map((menu) => (
          <li key={menu.title} className="flex flex-col gap-1">
            <p className="text-white font-bold">{menu.title}</p>
            <div className="flex flex-col gap-2">
              {menu.list.map((item) => (
                <button key={item.title} className={`hover:bg-purple-400 p-3 rounded-xl text-white flex items-center gap-1 cursor-pointer ${location.pathname.startsWith(item.path) ? "bg-purple-400" : ""}`}>
                  {item.icon}
                  <p>{item.title}</p>
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-[1] items-end">
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-400 p-3 rounded-xl text-white flex items-center gap-1 cursor-pointer">
          <RiLogoutBoxFill />
          <p>Logout</p>
        </button>
      </div>
    </>
  );
}

export default Sidebar;

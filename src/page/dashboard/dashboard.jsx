import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaList, FaCalendarAlt, FaImage, FaPercent, FaShoppingCart, FaClock, FaChartBar, FaUsersCog, FaTags, FaTicketAlt, FaBullhorn, FaGift, FaReceipt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalActivities: 0,
    totalBanners: 0,
    totalPromos: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    // Check if user is admin
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.role !== "admin") {
      navigate("/");
      return;
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const headers = {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      };

      // Fetch all data in parallel
      const [usersRes, categoriesRes, activitiesRes, bannersRes, promosRes, transactionsRes] = await Promise.all([
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user", { headers }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", { headers }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", { headers }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners", { headers }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", { headers }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions", { headers }),
      ]);

      const transactions = transactionsRes.data.data || [];
      const pendingTransactions = transactions.filter((t) => t.status === "pending");

      setStats({
        totalUsers: usersRes.data.data?.length || 0,
        totalCategories: categoriesRes.data.data?.length || 0,
        totalActivities: activitiesRes.data.data?.length || 0,
        totalBanners: bannersRes.data.data?.length || 0,
        totalPromos: promosRes.data.data?.length || 0,
        totalOrders: transactions.length,
        pendingOrders: pendingTransactions.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminMenuItems = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: FaUsersCog,
      path: "/dashboard/users",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "Manage Categories",
      description: "Add, edit, and delete categories",
      icon: FaTags,
      path: "/dashboard/categories",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Manage Activities",
      description: "Manage travel activities",
      icon: FaTicketAlt,
      path: "/dashboard/activities",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "Manage Banners",
      description: "Update promotional banners",
      icon: FaBullhorn,
      path: "/dashboard/banners",
      hoverColor: "hover:bg-orange-600",
    },
    {
      title: "Manage Promos",
      description: "Create and manage promotions",
      icon: FaGift,
      path: "/dashboard/promos",
      hoverColor: "hover:bg-pink-600",
    },
    {
      title: "Manage Orders",
      description: "View and process orders",
      icon: FaReceipt,
      path: "/dashboard/orders",
      hoverColor: "hover:bg-indigo-600",
    },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: FaList,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Activities",
      value: stats.totalActivities,
      icon: FaCalendarAlt,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Total Banners",
      value: stats.totalBanners,
      icon: FaImage,
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
    {
      title: "Total Promos",
      value: stats.totalPromos,
      icon: FaPercent,
      color: "bg-pink-500",
      textColor: "text-pink-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: FaClock,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 md:px-40 lg:px-60 xl:px-96">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <IoArrowBack size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-md md:text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaChartBar className="text-[#28cdba]" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow flex">
                <div className="flex items-center justify-between grow-1">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className={`text-md md:text-lg font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                  <div className={`${card.color} p-2 md:p-3 rounded-full flex-shrink-0`}>
                    <IconComponent className="text-white" size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Menu */}
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-6">
          <h2 className="text-sm md:text-lg font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
            <FaUsersCog className="text-[#28cdba]" />
            <span className="hidden sm:inline">Admin Management</span>
            <span className="sm:hidden">Management</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {adminMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button key={index} onClick={() => navigate(item.path)} className="bg-white text-[#28cdba] border-2 border-[#28cdba] p-4 md:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="text-center">
                    <IconComponent className="mx-auto mb-3 md:mb-4" size={24} />
                    <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{item.title}</h3>
                    <p className="text-xs md:text-sm opacity-90 hidden sm:block">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

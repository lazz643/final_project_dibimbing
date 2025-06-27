import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaTicketAlt, FaEye, FaStar, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage, setActivitiesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [""],
    price: "",
    price_discount: "",
    rating: "",
    total_reviews: "",
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateActivity = async () => {
    try {
      setSubmitLoading(true);
      setFormErrors({});
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        price: parseInt(formData.price),
        price_discount: parseInt(formData.price_discount),
        rating: parseInt(formData.rating),
        total_reviews: parseInt(formData.total_reviews),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
      };

      await axios.post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity", payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchActivities();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating activity:", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: "Failed to create activity" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateActivity = async () => {
    try {
      setSubmitLoading(true);
      setFormErrors({});
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        price: parseInt(formData.price),
        price_discount: parseInt(formData.price_discount),
        rating: parseInt(formData.rating),
        total_reviews: parseInt(formData.total_reviews),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
      };

      await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${selectedActivity.id}`, payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchActivities();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating activity:", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: "Failed to update activity" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${activityId}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity");
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      title: "",
      description: "",
      imageUrls: [""],
      price: "",
      price_discount: "",
      rating: "",
      total_reviews: "",
      facilities: "",
      address: "",
      province: "",
      city: "",
      location_maps: "",
    });
    setFormErrors({});
    setSelectedActivity(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setShowModal(true);
  };

  const openEditModal = (activity) => {
    setFormData({
      categoryId: activity.categoryId,
      title: activity.title,
      description: activity.description,
      imageUrls: activity.imageUrls.length > 0 ? activity.imageUrls : [""],
      price: activity.price.toString(),
      price_discount: activity.price_discount.toString(),
      rating: activity.rating.toString(),
      total_reviews: activity.total_reviews.toString(),
      facilities: activity.facilities,
      address: activity.address,
      province: activity.province,
      city: activity.city,
      location_maps: activity.location_maps,
    });
    setSelectedActivity(activity);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const removeImageUrl = (index) => {
    if (formData.imageUrls.length > 1) {
      const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      handleCreateActivity();
    } else {
      handleUpdateActivity();
    }
  };

  // Filter activities based on search term
  const filteredActivities = activities.filter(
    (activity) => activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || activity.city.toLowerCase().includes(searchTerm.toLowerCase()) || activity.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleActivitiesPerPageChange = (e) => {
    setActivitiesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => (arr.indexOf(item) === index && item !== 1) || index === 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/dashboard")} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaTicketAlt className="text-[#28cdba]" />
                  Manage Activities
                </h1>
                <p className="text-gray-600 mt-1">Manage travel activities and experiences</p>
              </div>
            </div>
            <button onClick={openCreateModal} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20b5a5] transition-colors flex items-center gap-2 text-sm font-medium">
              <FaPlus size={14} />
              Add New Activity
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by title, city, or province..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
              <select value={activitiesPerPage} onChange={handleActivitiesPerPageChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#28cdba] focus:border-transparent">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label className="text-sm text-gray-600 whitespace-nowrap">per page</label>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaTicketAlt className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length > 0 ? (activities.reduce((sum, act) => sum + act.rating, 0) / activities.length).toFixed(1) : "0"}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaStar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{activities.reduce((sum, act) => sum + act.total_reviews, 0)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaEye className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredActivities.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaSearch className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={activity.imageUrls[0] || "https://via.placeholder.com/64x64?text=No+Image"}
                            alt={activity.title}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500">{activity.description.length > 50 ? `${activity.description.substring(0, 50)}...` : activity.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.category?.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.city}</div>
                      <div className="text-sm text-gray-500">{activity.province}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(activity.price)}</div>
                      {activity.price_discount > 0 && <div className="text-sm text-red-500">Disc: {formatPrice(activity.price_discount)}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" size={14} />
                        <span className="text-sm text-gray-900">{activity.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({activity.total_reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(activity)} className="text-[#28cdba] hover:text-[#20b5a5] p-1 rounded transition-colors" title="Edit">
                          <FaEdit size={16} />
                        </button>
                        <button onClick={() => handleDeleteActivity(activity.id)} className="text-red-600 hover:text-red-800 p-1 rounded transition-colors" title="Delete">
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-3">
                <img
                  className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                  src={activity.imageUrls[0] || "https://via.placeholder.com/80x80?text=No+Image"}
                  alt={activity.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{activity.category?.name || "N/A"}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      <FaMapMarkerAlt className="text-gray-400 mr-1" size={10} />
                      <span>
                        {activity.city}, {activity.province}
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FaMoneyBillWave className="text-gray-400 mr-1" size={10} />
                      <span>{formatPrice(activity.price)}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FaStar className="text-yellow-400 mr-1" size={10} />
                      <span>
                        {activity.rating} ({activity.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <button onClick={() => openEditModal(activity)} className="text-[#28cdba] hover:text-[#20b5a5] p-2 rounded transition-colors" title="Edit">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDeleteActivity(activity.id)} className="text-red-600 hover:text-red-800 p-2 rounded transition-colors" title="Delete">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
            <p className="mt-2 text-gray-500">{searchTerm ? "Try adjusting your search terms" : "Get started by creating your first activity"}</p>
            {!searchTerm && (
              <button onClick={openCreateModal} className="mt-4 bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20b5a5] transition-colors flex items-center gap-2 mx-auto text-sm font-medium">
                <FaPlus size={14} />
                Add New Activity
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="px-4 md:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[12px] text-gray-700 order-2 sm:order-1">
                  Showing {(currentPage - 1) * activitiesPerPage + 1} to {Math.min(currentPage * activitiesPerPage, filteredActivities.length)} of {filteredActivities.length} activities
                </div>
                <div className="flex items-center space-x-1 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-[12px] font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <FaChevronLeft size={12} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers - Hidden on mobile, show page info instead */}
                  <div className="hidden md:flex">
                    {getPaginationNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNumber === "number" && handlePageChange(pageNumber)}
                        disabled={pageNumber === "..."}
                        className={`px-2 py-1 text-[12px] font-medium border-t border-b border-r border-gray-300 transition-colors ${
                          pageNumber === currentPage ? "bg-[#28cdba] text-white border-[#28cdba]" : pageNumber === "..." ? "bg-white text-gray-400 cursor-default" : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Page Info */}
                  <div className="md:hidden px-2 py-1 text-[12px] font-medium bg-white border-t border-b border-r border-gray-300">
                    {currentPage} / {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-[12px] font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{modalMode === "create" ? "Create New Activity" : "Edit Activity"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>

              {formErrors.general && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{formErrors.general}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent">
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="Enter activity title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="Enter activity description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs *</label>
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.imageUrls.length > 1 && (
                        <button type="button" onClick={() => removeImageUrl(index)} className="text-red-600 hover:text-red-800 p-2">
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Discount</label>
                    <input
                      type="number"
                      name="price_discount"
                      value={formData.price_discount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Reviews *</label>
                    <input
                      type="number"
                      name="total_reviews"
                      value={formData.total_reviews}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                  <textarea
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="Enter facilities description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="Enter province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Maps (iframe)</label>
                  <textarea
                    name="location_maps"
                    value={formData.location_maps}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="<iframe src='...' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy'></iframe>"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-[#28cdba] text-white rounded-lg hover:bg-[#20b5a5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {submitLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {modalMode === "create" ? "Create Activity" : "Update Activity"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminActivity;

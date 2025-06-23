import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaGift, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminPromo() {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promosPerPage, setPromosPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setPromos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching promos:", error);
      setError("Failed to fetch promos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async () => {
    try {
      setSubmitLoading(true);
      setFormErrors({});
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        promo_discount_price: parseInt(formData.promo_discount_price),
        minimum_claim_price: parseInt(formData.minimum_claim_price),
      };

      await axios.post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-promo", payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchPromos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating promo:", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: "Failed to create promo" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdatePromo = async () => {
    try {
      setSubmitLoading(true);
      setFormErrors({});
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        promo_discount_price: parseInt(formData.promo_discount_price),
        minimum_claim_price: parseInt(formData.minimum_claim_price),
      };

      await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-promo/${selectedPromo.id}`, payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchPromos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating promo:", error);
      if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: "Failed to update promo" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePromo = async (promoId) => {
    if (!window.confirm("Are you sure you want to delete this promo?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-promo/${promoId}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchPromos();
    } catch (error) {
      console.error("Error deleting promo:", error);
      alert("Failed to delete promo");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setFormErrors({});
    setSelectedPromo(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setShowModal(true);
  };

  const openEditModal = (promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price.toString(),
      minimum_claim_price: promo.minimum_claim_price.toString(),
    });
    setSelectedPromo(promo);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      handleCreatePromo();
    } else {
      handleUpdatePromo();
    }
  };

  // Filter promos based on search term
  const filteredPromos = promos.filter((promo) => promo.title.toLowerCase().includes(searchTerm.toLowerCase()) || promo.promo_code.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination logic
  const indexOfLastPromo = currentPage * promosPerPage;
  const indexOfFirstPromo = indexOfLastPromo - promosPerPage;
  const currentPromos = filteredPromos.slice(indexOfFirstPromo, indexOfLastPromo);
  const totalPages = Math.ceil(filteredPromos.length / promosPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePromosPerPageChange = (e) => {
    setPromosPerPage(parseInt(e.target.value));
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
          <p className="mt-4 text-gray-600">Loading promos...</p>
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
                  <FaGift className="text-[#28cdba]" />
                  Manage Promos
                </h1>
                <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
              </div>
            </div>
            <button onClick={openCreateModal} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20b5a5] transition-colors flex items-center gap-2 text-sm font-medium">
              <FaPlus size={14} />
              Add New Promo
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
                  placeholder="Search by title or promo code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
              <select value={promosPerPage} onChange={handlePromosPerPageChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#28cdba] focus:border-transparent">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Promos</p>
                <p className="text-2xl font-bold text-gray-900">{promos.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaGift className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Promos</p>
                <p className="text-2xl font-bold text-gray-900">{promos.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{filteredPromos.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaSearch className="text-purple-600" size={24} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Claim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPromos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={promo.imageUrl}
                            alt={promo.title}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{promo.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{promo.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#28cdba] text-white">{promo.promo_code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(promo.promo_discount_price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(promo.minimum_claim_price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(promo.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(promo)} className="text-[#28cdba] hover:text-[#20b5a5] p-1 rounded transition-colors" title="Edit">
                          <FaEdit size={16} />
                        </button>
                        <button onClick={() => handleDeletePromo(promo.id)} className="text-red-600 hover:text-red-800 p-1 rounded transition-colors" title="Delete">
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
          {currentPromos.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-3">
                <img
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  src={promo.imageUrl}
                  alt={promo.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{promo.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{promo.description}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Code:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#28cdba] text-white">{promo.promo_code}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Discount:</span>
                      <span className="font-medium">{formatCurrency(promo.promo_discount_price)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Min. Claim:</span>
                      <span className="font-medium">{formatCurrency(promo.minimum_claim_price)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Created:</span>
                      <span>{formatDate(promo.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <button onClick={() => openEditModal(promo)} className="text-[#28cdba] hover:text-[#20b5a5] p-2 rounded transition-colors" title="Edit">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDeletePromo(promo.id)} className="text-red-600 hover:text-red-800 p-2 rounded transition-colors" title="Delete">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPromos.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaGift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No promos found</h3>
            <p className="mt-2 text-gray-500">{searchTerm ? "Try adjusting your search terms" : "Get started by creating your first promo"}</p>
            {!searchTerm && (
              <button onClick={openCreateModal} className="mt-4 bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20b5a5] transition-colors flex items-center gap-2 mx-auto text-sm font-medium">
                <FaPlus size={14} />
                Add New Promo
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
                  Showing {(currentPage - 1) * promosPerPage + 1} to {Math.min(currentPage * promosPerPage, filteredPromos.length)} of {filteredPromos.length} promos
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{modalMode === "create" ? "Create New Promo" : "Edit Promo"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>

              {formErrors.general && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{formErrors.general}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="Enter promo title"
                  />
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
                    placeholder="Enter promo description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions *</label>
                  <textarea
                    name="terms_condition"
                    value={formData.terms_condition}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="Enter terms and conditions"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code *</label>
                    <input
                      type="text"
                      name="promo_code"
                      value={formData.promo_code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="PROMO2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (IDR) *</label>
                    <input
                      type="number"
                      name="promo_discount_price"
                      value={formData.promo_discount_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Claim Price (IDR) *</label>
                  <input
                    type="number"
                    name="minimum_claim_price"
                    value={formData.minimum_claim_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    placeholder="500000"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-[#28cdba] text-white rounded-lg hover:bg-[#20b5a5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {submitLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {modalMode === "create" ? "Create Promo" : "Update Promo"}
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

export default AdminPromo;

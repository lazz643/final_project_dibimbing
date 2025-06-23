import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaReceipt, FaEdit, FaSave, FaTimes, FaEye, FaChevronLeft, FaChevronRight, FaArrowLeft, FaSearch, FaShoppingCart, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

function AdminOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is admin
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.role !== "admin") {
      navigate("/");
      return;
    }

    fetchTransactions();
  }, [navigate]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, statusFilter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, transactionsPerPage]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((transaction) => transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredTransactions(filtered);
  };

  const handleEditStatus = (transactionId, currentStatus) => {
    setEditingId(transactionId);
    setEditStatus(currentStatus);
  };

  const handleSaveStatus = async (transactionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transactionId}`,
        { status: editStatus },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setTransactions((prev) => prev.map((transaction) => (transaction.id === transactionId ? { ...transaction, status: editStatus } : transaction)));

      setEditingId(null);
      setEditStatus("");
    } catch (error) {
      console.error("Error updating transaction status:", error);
      alert("Failed to update transaction status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "canceled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
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

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTransactionsPerPageChange = (e) => {
    setTransactionsPerPage(parseInt(e.target.value));
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

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
    { value: "canceled", label: "Canceled" },
    { value: "all", label: "All Status" },
  ];

  const editStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
    { value: "canceled", label: "Canceled" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
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
                  <FaReceipt className="text-[#28cdba]" />
                  Manage Orders
                </h1>
                <p className="text-gray-600 mt-1">Manage transaction orders and status</p>
              </div>
            </div>
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
                  placeholder="Search by invoice ID or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#28cdba] focus:border-transparent">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
              <select value={transactionsPerPage} onChange={handleTransactionsPerPageChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#28cdba] focus:border-transparent">
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
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.filter((t) => t.status === "pending").length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Orders</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.filter((t) => t.status === "success").length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaSearch className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.invoiceId}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{transaction.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.payment_method?.imageUrl && <img src={transaction.payment_method.imageUrl} alt={transaction.payment_method.name} className="h-8 w-8 rounded mr-3" />}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.payment_method?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{transaction.payment_method?.virtual_account_number || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(transaction.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === transaction.id ? (
                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#28cdba]">
                          {editStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>{transaction.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.orderDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === transaction.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveStatus(transaction.id)} className="text-green-600 hover:text-green-900">
                            <FaSave />
                          </button>
                          <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleEditStatus(transaction.id, transaction.status)} className="text-[#28cdba] hover:text-[#20b5a5] p-1 rounded transition-colors">
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {currentTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.invoiceId}</h3>
                  <p className="text-sm text-gray-500 truncate">{transaction.id}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>{transaction.status}</span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="text-sm font-medium">{formatCurrency(transaction.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment:</span>
                  <span className="text-sm">{transaction.payment_method?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm">{formatDate(transaction.orderDate)}</span>
                </div>
              </div>

              {editingId === transaction.id ? (
                <div className="flex gap-2 items-center">
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#28cdba]">
                    {editStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleSaveStatus(transaction.id)} className="p-2 text-green-600 hover:text-green-900">
                    <FaSave />
                  </button>
                  <button onClick={handleCancelEdit} className="p-2 text-red-600 hover:text-red-900">
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => handleEditStatus(transaction.id, transaction.status)} className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors">
                    Edit Status
                  </button>
                  {transaction.proofPaymentUrl && (
                    <a href={transaction.proofPaymentUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      View Proof
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No transactions message */}
        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaReceipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">{statusFilter !== "all" ? `No transactions with status "${statusFilter}" found.` : "No transactions match your search criteria."}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="px-4 md:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[12px] text-gray-700 order-2 sm:order-1">
                  Showing {(currentPage - 1) * transactionsPerPage + 1} to {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
    </div>
  );
}

export default AdminOrder;

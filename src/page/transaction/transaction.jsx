import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaReceipt, FaClock, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

function Transaction() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort transactions by orderDate (newest first)
      const sortedTransactions = (response.data.data || []).sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
      });

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/front");
      }
    } finally {
      setLoading(false);
    }
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "failed":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "success":
        return "Berhasil";
      case "failed":
        return "Gagal";
      default:
        return status;
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <IoArrowBack size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaReceipt className="text-[#28cdba]" />
            Riwayat Transaksi
          </h1>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <FaReceipt size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Belum ada transaksi</h2>
            <p className="text-gray-500 mb-6">Mulai booking aktivitas untuk melihat riwayat transaksi!</p>
            <button onClick={() => navigate("/activity")} className="bg-[#28cdba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors">
              Browse Activities
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Transaction Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{transaction.invoiceId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(transaction.orderDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border overflow-hidden">
                    <img
                      src={transaction.payment_method?.imageUrl}
                      alt={transaction.payment_method?.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <span className="text-xs text-gray-500 hidden">{transaction.payment_method?.name}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.payment_method?.name}</p>
                    {transaction.payment_method?.virtual_account_number && <p className="text-sm text-gray-500">VA: {transaction.payment_method.virtual_account_number}</p>}
                  </div>
                </div>

                {/* Transaction Items */}
                <div className="space-y-3 mb-4">
                  {transaction.transaction_items?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 border rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrls?.[0] || "/placeholder-image.jpg"} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <div className="text-right">
                            {item.price_discount > 0 ? (
                              <>
                                <span className="text-xs text-gray-400 line-through block">{formatPrice(item.price)}</span>
                                <span className="text-sm font-medium text-[#28cdba]">{formatPrice(item.price_discount)}</span>
                              </>
                            ) : (
                              <span className="text-sm font-medium text-[#28cdba]">{formatPrice(item.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transaction Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                    <p className="text-xl font-bold text-[#28cdba]">{formatPrice(transaction.totalAmount)}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                    {transaction.status === "pending" && transaction.expiredDate && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Batas Waktu Pembayaran</p>
                        <p className="text-sm font-medium text-red-600">{formatDate(transaction.expiredDate)}</p>
                      </div>
                    )}
                    <button onClick={() => navigate(`/transaction/${transaction.id}`)} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#20a89a] transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaction;

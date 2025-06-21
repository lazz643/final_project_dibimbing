import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaReceipt, FaClock, FaCheckCircle, FaTimesCircle, FaUpload, FaFileImage } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [proofPaymentUrl, setProofPaymentUrl] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setTransaction(response.data.data);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/front");
      } else if (error.response?.status === 404) {
        navigate("/transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProofPayment = async () => {
    if (!proofPaymentUrl.trim()) {
      alert("Silakan masukkan URL bukti pembayaran");
      return;
    }

    // try {
    //   new URL(proofPaymentUrl);
    // } catch {
    //   alert("URL tidak valid. Silakan masukkan URL yang benar");
    //   return;
    // }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }
    console.log("------Proof Payment URL:", token);

    try {
      setUploading(true);

      // Upload proof payment
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${id}`,
        {
          proofPaymentUrl: proofPaymentUrl,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUploadSuccess(true);
      // Refresh transaction data
      fetchTransactionDetail();
      alert("Bukti pembayaran berhasil diupload dan status transaksi telah diperbarui!");
    } catch (error) {
      console.error("Error uploading proof payment:", error);
      alert("Gagal mengupload bukti pembayaran. Silakan coba lagi.");
    } finally {
      setUploading(false);
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
          <p className="text-gray-600">Loading transaction detail...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaReceipt size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Transaksi tidak ditemukan</h2>
          <button onClick={() => navigate("/transaction")} className="bg-[#28cdba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors">
            Kembali ke Riwayat Transaksi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/transaction")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <IoArrowBack size={20} />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaReceipt className="text-[#28cdba]" />
            Detail Transaksi
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Transaction Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{transaction.invoiceId}</h2>
              <p className="text-gray-600">Tanggal Order: {formatDate(transaction.orderDate)}</p>
              {transaction.expiredDate && <p className="text-gray-600">Batas Waktu: {formatDate(transaction.expiredDate)}</p>}
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                {getStatusIcon(transaction.status)}
                {getStatusText(transaction.status)}
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pembayaran</p>
                <p className="text-2xl font-bold text-[#28cdba]">{formatPrice(transaction.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Metode Pembayaran</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border overflow-hidden">
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
                <p className="font-semibold text-gray-800 text-lg">{transaction.payment_method?.name}</p>
                {transaction.payment_method?.virtual_account_number && <p className="text-gray-600">Virtual Account: {transaction.payment_method.virtual_account_number}</p>}
                {transaction.payment_method?.virtual_account_name && <p className="text-gray-600">Atas Nama: {transaction.payment_method.virtual_account_name}</p>}
              </div>
            </div>
          </div>

          {/* Transaction Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Transaksi</h3>
            <div className="space-y-4">
              {transaction.transaction_items?.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.imageUrls?.[0] || "/placeholder-image.jpg"} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quantity: {item.quantity}</span>
                      <div className="text-right">
                        {item.price_discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-400 line-through block">{formatPrice(item.price)}</span>
                            <span className="text-lg font-semibold text-[#28cdba]">{formatPrice(item.price_discount)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-[#28cdba]">{formatPrice(item.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof Payment Section */}
          {transaction.status === "pending" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaUpload className="text-[#28cdba]" />
                Upload Bukti Pembayaran
              </h3>
              <p className="text-gray-600 mb-4">Silakan upload bukti pembayaran Anda dengan memasukkan URL gambar bukti pembayaran.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Bukti Pembayaran</label>
                  <input
                    type="url"
                    value={proofPaymentUrl}
                    onChange={(e) => setProofPaymentUrl(e.target.value)}
                    placeholder="https://example.com/bukti-pembayaran.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                    disabled={uploading}
                  />
                </div>
                <button
                  onClick={handleUploadProofPayment}
                  disabled={uploading || !proofPaymentUrl.trim()}
                  className="bg-[#28cdba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Upload Bukti Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Proof Payment Display */}
          {transaction.proofPaymentUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaFileImage className="text-[#28cdba]" />
                Bukti Pembayaran
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <a href={transaction.proofPaymentUrl} target="_blank" rel="noopener noreferrer" className="text-[#28cdba] hover:text-[#20a89a] underline">
                  Lihat Bukti Pembayaran
                </a>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <FaCheckCircle />
                <p className="font-medium">Bukti pembayaran berhasil diupload dan status transaksi telah diperbarui!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;

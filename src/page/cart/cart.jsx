import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchPaymentMethods();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/front");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(response.data.data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const updateCartQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartId}`,
        { quantity: newQuantity },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
      // Dispatch cart updated event
      const updateCartEvent = new CustomEvent("cartUpdated");
      window.dispatchEvent(updateCartEvent);
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart item");
    }
  };

  const removeFromCart = async (cartId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCartItems();
      // Dispatch cart updated event
      const updateCartEvent = new CustomEvent("cartUpdated");
      window.dispatchEvent(updateCartEvent);
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove cart item");
    }
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setShowPaymentSelection(true);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      setIsCheckingOut(true);
      const cartIds = cartItems.map((item) => item.id);
      console.log("---------", cartIds, selectedPaymentMethod);
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          cartIds: cartIds,
          paymentMethodId: selectedPaymentMethod,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "OK") {
        alert("Transaction created successfully!");
        setShowPaymentSelection(false);
        setSelectedPaymentMethod(null);
        // Dispatch cart updated event to reset badge to 0
        const updateCartEvent = new CustomEvent("cartUpdated");
        window.dispatchEvent(updateCartEvent);
        navigate("/transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.activity?.price_discount || item.activity?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
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
            <FaShoppingCart className="text-[#28cdba]" />
            Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some activities to get started!</p>
            <button onClick={() => navigate("/activity")} className="bg-[#28cdba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors">
              Browse Activities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Activity Image */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.activity?.imageUrls?.[0] || "/placeholder-image.jpg"} alt={item.activity?.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Activity Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.activity?.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.activity?.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span>📍 {item.activity?.city}</span>
                        <span>⭐ {item.activity?.rating || "N/A"}</span>
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-[#28cdba]">
                          {item.activity?.price_discount ? (
                            <>
                              <span className="text-sm text-gray-400 line-through mr-2">{formatPrice(item.activity.price)}</span>
                              {formatPrice(item.activity.price_discount)}
                            </>
                          ) : (
                            formatPrice(item.activity?.price || 0)
                          )}
                          <span className="text-sm text-gray-500 font-normal"> / person</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                              <FaPlus size={12} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition-colors p-2">
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => {
                    const price = item.activity?.price_discount || item.activity?.price || 0;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.activity?.title} x {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#28cdba]">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                {!showPaymentSelection ? (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#28cdba] text-white py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Payment
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === method.id ? "border-[#28cdba] bg-[#28cdba]/5" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border-gray-300 border-2 overflow-hidden">
                            <img
                              src={method.imageUrl}
                              alt={method.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                              }}
                            />
                            <span className="text-xs text-gray-500 hidden">{method.name}</span>
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{method.name}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === method.id ? "border-[#28cdba] bg-[#28cdba]" : "border-gray-300"}`}>
                            {selectedPaymentMethod === method.id && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowPaymentSelection(false);
                          setSelectedPaymentMethod(null);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !selectedPaymentMethod}
                        className="flex-1 bg-[#28cdba] text-white py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">By proceeding, you agree to our terms and conditions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

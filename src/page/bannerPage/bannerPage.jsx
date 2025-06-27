import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle, AiFillStar } from "react-icons/ai";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

function BannerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBannerDetail();
  }, [id]);

  const fetchBannerDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banner/${id}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      });
      setBanner(response.data.data);
    } catch (error) {
      console.error("Error fetching banner detail:", error);
      setError("Failed to load banner details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banner details...</p>
        </div>
      </div>
    );
  }

  if (error || !banner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">{error || "Banner not found"}</h2>
          <button onClick={() => navigate("/")} className="bg-[#28cdba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-[#28cdba] transition-colors">
            <IoArrowBack size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={banner.imageUrl} alt={banner.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{banner.name}</h1>
              <div className="flex flex-wrap gap-4 text-white mb-6">
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="text-[#28cdba]" size={20} />
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <AiOutlineClockCircle className="text-[#28cdba]" size={20} />
                  <span>3 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <AiFillStar className="text-[#28cdba]" size={20} />
                  <span>4.8 (200 reviews)</span>
                </div>
              </div>
              <p className="text-white text-md mb-8 leading-relaxed">Discover the magic and wonder of this incredible destination. Perfect for families, solo travelers, and friends looking to explore and enjoy unforgettable experiences.</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl md:text-3xl font-bold text-white">Rp 999.000</p>
                  <p className="text-white/80">* Price per Person</p>
                </div>
                <button className="bg-[#28cdba] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#20a89a] transition-colors text-md">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div>
            {/* About Section */}
            <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Experience</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Immerse yourself in a world of wonder and excitement at {banner.name}. This magical destination offers unforgettable experiences for visitors of all ages, combining thrilling attractions, spectacular shows, and enchanting
                atmospheres.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                From heart-pounding rides to magical parades, every moment is designed to create lasting memories. Whether you're seeking adventure, relaxation, or family fun, this destination has something special for everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-[#28cdba] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Duration</h4>
                    <p className="text-gray-600">3 Days 2 Nights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUsers className="text-[#28cdba] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Group Size</h4>
                    <p className="text-gray-600">Up to 20 people</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#28cdba] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                    <p className="text-gray-600">Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AiFillStar className="text-[#28cdba] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Rating</h4>
                    <p className="text-gray-600">4.8/5 (200 reviews)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Entrance tickets</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Professional guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Transportation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Meals included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Hotel accommodation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#28cdba] rounded-full"></div>
                  <span className="text-gray-600">Travel insurance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Info */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Banner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-sm text-gray-500 block mb-2">Banner ID</span>
                <p className="font-bold text-lg text-gray-800">{banner.id}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500 block mb-2">Created</span>
                <p className="font-bold text-lg text-gray-800">{formatDate(banner.createdAt)}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500 block mb-2">Last Updated</span>
                <p className="font-bold text-lg text-gray-800">{formatDate(banner.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerPage;

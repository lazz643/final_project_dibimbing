import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar, AiOutlineClockCircle } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { MdChevronRight, MdLocalOffer } from "react-icons/md";
import { FaShoppingCart, FaShareAlt, FaCopy } from "react-icons/fa";

function PromoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromoDetail = async () => {
      try {
        setLoading(true);
        // Fetch promo detail
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${id}`, {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setPromo(response.data.data);

        // Fetch activities that might be related to this promo
        const activitiesResponse = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });

        // Get random activities to display
        const randomActivities = activitiesResponse.data.data.sort(() => 0.5 - Math.random()).slice(0, 4);

        setRelatedActivities(randomActivities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching promo details:", error);
        setLoading(false);
      }
    };

    fetchPromoDetail();
  }, [id]);

  const handleCopyPromoCode = () => {
    if (promo && promo.promo_code) {
      navigator.clipboard.writeText(promo.promo_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderRelatedActivityCard = (act) => (
    <div key={act.id} className="flex flex-col w-full rounded-2xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 w-full relative">
        <img src={act.imageUrls} alt={act.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 grow flex flex-col gap-2">
        <h3 className="font-medium text-base">{act.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <IoLocationOutline size={14} />
          <span>{act.city ? `${act.city}, ${act.province}` : `${act.province}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <AiFillStar className="text-yellow-400" size={14} />
          <span className="text-xs">{`${act.rating} (${act.total_reviews} reviews)`}</span>
        </div>

        <div className="flex items-end justify-between mt-1 grow">
          <div className="flex flex-col">
            {act.price_discount && <span className="text-xs text-gray-400 line-through">Rp {act.price}</span>}
            <span className="text-sm font-semibold text-[#28cdba]">Rp {act.price_discount || act.price}</span>
          </div>
          <button onClick={() => navigate(`/activity/${act.id}`)} className="bg-[#28cdba] text-white p-2 rounded-full hover:bg-[#20a89a] transition-colors">
            <MdChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading promo details...</p>
        </div>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="px-96 py-10 min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center">
        <p className="text-xl mb-4">Promo not found</p>
        <button onClick={() => navigate("/promo")} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20a89a] transition-colors">
          Back to Promos
        </button>
      </div>
    );
  }

  return (
    <div className="px-96 py-4 min-h-screen bg-[#f5f5f5]">
      {/* Back Button */}
      <div className="mb-2">
        <button onClick={() => navigate("/promo")} className="flex items-center gap-2 text-gray-600 hover:text-[#28cdba] transition-colors">
          <MdChevronRight className="rotate-180" size={20} />
          <span>Back to Promos</span>
        </button>
      </div>

      {/* Container 1 - Main Content */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Section - flex 3 */}
        <div className="flex-2 w-full md:w-3/4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{promo.title}</h1>

            <div className="flex items-center gap-2 mb-2 text-[12px]">
              <div className="flex items-center gap-1 text-gray-600">
                <AiOutlineClockCircle size={18} />
                <span>Expires in 10 days</span>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 text-[12px]">{promo.description}</p>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
            <ul className="text-gray-600 text-[12px] list-disc pl-5 space-y-2">
              <li>Valid for bookings made between xxx and xxx</li>
              <li>Cannot be combined with other promotions or discounts</li>
              <li>Subject to availability</li>
              <li>The management reserves the right to modify or cancel this promotion at any time</li>
              <li>Other terms and conditions may apply</li>
            </ul>
          </div>
        </div>

        {/* Right Section - flex 1 */}
        <div className="flex-1 w-full md:w-1/4">
          <div className="bg-white rounded-2xl p-4 shadow-md sticky top-20">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Promo Details</h2>
              <p className="text-sm text-gray-500">Use this code at checkout</p>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2 bg-[#f0fbfa] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdLocalOffer className="text-[#28cdba]" size={20} />
                  <p className="text-[16px] font-medium text-[#28cdba]">{promo.promo_code}</p>
                </div>
                <button onClick={handleCopyPromoCode} className="text-gray-500 hover:text-[#28cdba] transition-colors" title="Copy promo code">
                  <FaCopy size={16} />
                </button>
              </div>
              {copied && <p className="text-xs text-green-500 mt-1 text-center">Copied to clipboard!</p>}
            </div>

            {/* Discount Info */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Discount</h3>
              <p className="text-2xl font-bold text-[#28cdba]">{promo.discount_percentage || 10}%</p>
              <p className="text-xs text-gray-500">off selected activities</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6 text-[12px]">
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <FaShareAlt size={16} />
                Share
              </button>
            </div>

            {/* Browse Activities Button */}
            <button onClick={() => navigate("/activity")} className="w-full bg-[#28cdba] text-white py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors flex items-center justify-center gap-2">
              <FaShoppingCart size={16} />
              Browse Activities
            </button>
          </div>
        </div>
      </div>

      {/* Container 2 - Related Activities */}
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activities You Can Use This Promo On</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedActivities.length > 0 ? relatedActivities.map((activity) => renderRelatedActivityCard(activity)) : <p className="col-span-4 text-center text-gray-500 py-8">No activities available for this promo</p>}
        </div>
      </div>
    </div>
  );
}

export default PromoDetail;

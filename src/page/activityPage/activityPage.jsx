import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function ActivityPage() {
  const navigator = useNavigate();
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setActivities(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Render activity card
  const renderActivityCard = (act, index) => (
    <div onClick={() => navigator(`/activity/${act.id}`)} key={index} className="flex flex-col w-full h-auto rounded-xl md:rounded-2xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className="h-32 md:h-40 w-full relative">
        <img src={act.imageUrls} alt={act.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar size={12} className="md:size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-3 grow flex flex-col gap-1 md:gap-2">
        <h3 className="font-medium text-sm md:text-base line-clamp-2">{act.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <IoLocationOutline size={12} className="md:size-[14px]" />
          <span className="truncate">{act.city ? `${act.city}, ${act.province}` : `${act.province}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <AiFillStar className="text-yellow-400" size={12} />
          <span className="text-xs">{`${act.rating} (${act.total_reviews} reviews)`}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{act.description}</p>

        <div className="flex items-end justify-between mt-1 grow">
          <div className="flex flex-col">
            {act.price_discount > 0 && <span className="text-xs text-gray-400 line-through">Rp {act.price}</span>}
            <span className="text-xs md:text-sm font-semibold text-[#28cdba]">Rp {act.price_discount || act.price}</span>
          </div>
          <button className="bg-[#28cdba] text-white p-1.5 md:p-2 rounded-full hover:bg-[#20a89a] transition-colors">
            <FaShoppingCart size={12} className="md:size-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-96 py-6 md:py-10 min-h-screen bg-[#f5f5f5]">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#28cdba] mb-2">All Activities</h1>
        <p className="text-xs md:text-sm text-gray-600">Discover exciting activities and experiences for your next adventure</p>
      </div>

      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
            <p className="text-sm md:text-base text-gray-600">Loading activities...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Items per page selector */}
          <div className="flex justify-center md:justify-end mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-xs md:text-sm">
                Items per page:
              </label>
              <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="border border-gray-300 rounded-md px-2 py-1 text-xs md:text-sm">
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>

          {/* Activities grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">{currentItems.map((activity, index) => renderActivityCard(activity, index))}</div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 gap-4">
            <div className="text-xs md:text-sm text-gray-600 order-2 md:order-1">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, activities.length)} of {activities.length} activities
            </div>
            <div className="flex gap-1 md:gap-2 items-center order-1 md:order-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 md:px-3 py-1 md:py-0.5 rounded-lg flex items-center text-xs ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#28cdba] text-white hover:bg-[#20a89a]"}`}
              >
                <MdChevronLeft size={16} className="md:size-[18px]" />
                <span className="text-[10px] md:text-[10px] hidden sm:inline">Prev</span>
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`w-6 h-6 md:w-6 md:h-6 rounded-full text-[10px] ${currentPage === number + 1 ? "bg-[#28cdba] text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"}`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-2 md:px-3 py-1 md:py-0.5 rounded-lg flex items-center text-xs ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#28cdba] text-white hover:bg-[#20a89a]"}`}
              >
                <span className="text-[10px] md:text-[10px] hidden sm:inline">Next</span>
                <MdChevronRight size={16} className="md:size-[18px]" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityPage;

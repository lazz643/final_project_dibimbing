import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronRight, MdChevronLeft, MdLocalOffer } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";

function PromoPage() {
  const navigator = useNavigate();
  const [promos, setPromos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setPromos(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching promos:", error);
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = promos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(promos.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Render promo card
  const renderPromoCard = (promo, index) => (
    <div key={index} className="flex flex-col w-full h-auto rounded-xl md:rounded-2xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-32 md:h-40 w-full relative">
        <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex items-end p-2 md:p-3 text-white">
            <h3 className="font-medium text-sm md:text-lg">{promo.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-3 grow flex flex-col gap-2 md:gap-3">
        <div className="flex items-center gap-1 md:gap-1.5 bg-[#f0fbfa] p-1.5 md:p-2 rounded-lg w-fit">
          <MdLocalOffer className="text-[#28cdba]" size={12} />
          <p className="text-xs md:text-sm font-medium text-[#28cdba]">{promo.promo_code}</p>
        </div>

        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{promo.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <AiOutlineClockCircle className="text-gray-500" size={12} />
            <p className="text-[10px] md:text-xs text-gray-500">Expires in 10 days</p>
          </div>

          <button onClick={() => navigator(`/promo/${promo.id}`)} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] p-1">
            <MdChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-96 py-6 md:py-10 min-h-screen bg-[#f5f5f5]">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#28cdba] mb-2">Special Promos</h1>
        <p className="text-xs md:text-sm text-gray-600">Exclusive deals and discounts for your next adventure</p>
      </div>

      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm md:text-base">Loading promos...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Items per page selector */}
          <div className="flex justify-end mb-4 md:mb-6">
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

          {/* Promos grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">{currentItems.map((promo, index) => renderPromoCard(promo, index))}</div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 gap-4">
            <div className="text-xs md:text-sm text-gray-600 order-2 md:order-1">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, promos.length)} of {promos.length} promos
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

export default PromoPage;

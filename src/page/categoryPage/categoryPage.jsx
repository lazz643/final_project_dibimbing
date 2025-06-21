import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiOutlineStar } from "react-icons/ai";

function CategoryPage() {
  const navigator = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setCategories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Render category card
  const renderCategoryCard = (cat, index) => (
    <div key={index} className="flex flex-col w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-16px)] h-54 rounded-2xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg mb-6">
      <div className="h-40 w-full relative">
        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar />
            </button>
          </div>
          <div className="flex-1 flex items-end p-2 text-white">
            <p>{cat.name}</p>
          </div>
        </div>
      </div>
      <div className="p-2 grow flex items-center gap-3 justify-between">
        <p className="text-[14px]">Explore Category</p>
        <button onClick={() => navigator(`/category/${cat.id}`)} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] text-[8px]">
          <MdChevronRight size={12} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-96 py-10 min-h-screen bg-[#f5f5f5]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#28cdba] mb-2">All Categories</h1>
        <p className="text-sm text-gray-600">Discover all our categories and find your perfect adventure</p>
      </div>

      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Items per page selector */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm">
                Items per page:
              </label>
              <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>

          {/* Categories grid */}
          <div className="flex flex-wrap gap-4">{currentItems.map((category, index) => renderCategoryCard(category, index))}</div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, categories.length)} of {categories.length} categories
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-0.5 rounded-lg flex items-center ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#28cdba] text-white hover:bg-[#20a89a]"}`}
              >
                <MdChevronLeft size={18} />
                <span className="text-[10px]">Prev</span>
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`w-6 h-6 rounded-full text-[10px] ${currentPage === number + 1 ? "bg-[#28cdba] text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"}`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-0.5 rounded-lg flex items-center ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#28cdba] text-white hover:bg-[#20a89a]"}`}
              >
                <span className="text-[10px]">Next</span>
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { MdChevronRight } from "react-icons/md";

function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        setLoading(true);
        // Fetch category detail
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/category/${id}`, {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setCategory(response.data.data);

        // Fetch activities for this category
        const activitiesResponse = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });

        // Filter activities for this category
        const filtered = activitiesResponse.data.data.filter((activity) => activity.categoryId === id).slice(0, 4);

        setRelatedActivities(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [id]);

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
      <div className="px-96 py-10 min-h-screen bg-[#f5f5f5] flex justify-center items-center">
        <p>Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="px-96 py-10 min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center">
        <p className="text-xl mb-4">Category not found</p>
        <button onClick={() => navigate("/category")} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20a89a] transition-colors">
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="px-96 py-4 min-h-screen bg-[#f5f5f5]">
      {/* Back Button */}
      <div className="mb-2">
        <button onClick={() => navigate("/category")} className="flex items-center gap-2 text-gray-600 hover:text-[#28cdba] transition-colors">
          <MdChevronRight className="rotate-180" size={20} />
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Container 1 - Main Content */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Section - flex 2 */}
        <div className="flex-2 w-full md:w-3/4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
          </div>

          {/* Images Gallery */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 text-[12px]">{category.description || "Explore this amazing category and discover exciting activities and experiences."}</p>
          </div>
        </div>

        {/* Right Section - flex 1 */}
        <div className="flex-1 w-full md:w-1/4">
          <div className="bg-white rounded-2xl p-4 shadow-md sticky top-20">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Explore This Category</h2>
              <p className="text-sm text-gray-500">Find amazing activities and experiences</p>
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#28cdba] text-white py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors flex items-center justify-center gap-2">
              <MdChevronRight size={16} />
              Browse Activities
            </button>
          </div>
        </div>
      </div>

      {/* Container 2 - Related Activities */}
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activities in This Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedActivities.length > 0 ? relatedActivities.map((activity) => renderRelatedActivityCard(activity)) : <p className="col-span-4 text-center text-gray-500 py-8">No activities found for this category</p>}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetail;

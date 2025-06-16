import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { FaShoppingCart, FaHeart, FaShareAlt } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";

function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      rating: 5,
      comment: "Pengalaman yang luar biasa! Pemandangan indah dan pelayanan sangat baik.",
      date: "2023-10-15",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      rating: 4,
      comment: "Aktivitas yang menyenangkan untuk keluarga. Anak-anak sangat menikmatinya.",
      date: "2023-09-28",
    },
    {
      id: 3,
      user: {
        name: "Robert Johnson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      rating: 5,
      comment: "Sangat direkomendasikan! Pengalaman yang tak terlupakan.",
      date: "2023-09-10",
    },
  ]);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`, {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        setActivity(response.data.data);
        setLoading(false);

        // Fetch related activities
        const relatedResponse = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });

        // Filter out current activity
        const filtered = relatedResponse.data.data.filter((act) => act.id !== id).slice(0, 4);

        setRelatedActivities(filtered);
      } catch (error) {
        console.error("Error fetching activity details:", error);
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (review.trim() === "") return;

    const newReview = {
      id: reviews.length + 1,
      user: {
        name: "You",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      },
      rating: 5,
      comment: review,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setReview("");
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<AiFillStar key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"} size={16} />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="px-96 py-10 min-h-screen bg-[#f5f5f5] flex justify-center items-center">
        <p>Loading activity details...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="px-96 py-10 min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center">
        <p className="text-xl mb-4">Activity not found</p>
        <button onClick={() => navigate("/activity")} className="bg-[#28cdba] text-white px-4 py-2 rounded-lg hover:bg-[#20a89a] transition-colors">
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="px-96 py-4 min-h-screen bg-[#f5f5f5]">
      {/* Back Button */}
      <div className="mb-2">
        <button onClick={() => navigate("/activity")} className="flex items-center gap-2 text-gray-600 hover:text-[#28cdba] transition-colors">
          <MdChevronRight className="rotate-180" size={20} />
          <span>Back to Activities</span>
        </button>
      </div>

      {/* Container 1 - Main Content */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Section - flex 3 */}
        <div className="flex-2 w-full md:w-3/4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{activity.title}</h1>

            <div className="flex items-center gap-2 mb-2 text-[12px]">
              <div className="flex items-center gap-1 ">
                <AiFillStar className="text-yellow-400" size={18} />
                <span className="font-medium">{activity.rating}</span>
                <span className="text-gray-500">({activity.total_reviews} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 text-gray-600">
                <IoLocationOutline size={18} />
                <span>{activity.city ? `${activity.city}, ${activity.province}` : activity.province}</span>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={activity.imageUrls} alt={activity.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 text-[12px]">{activity.description}</p>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Facilities</h2>
            <div className="flex items-center gap-2 bg-[#f0fbfa] p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#28cdba] flex items-center justify-center text-white">
                <span>✓</span>
              </div>
              <span className="text-gray-700 text-[12px]">{activity.facilities}</span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <p className="text-gray-400">Map would be displayed here</p>
            </div>
            <p className="text-gray-600 text-[12px]">{activity.address || "No address information available"}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Your avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] mb-2 focus:outline-none focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">{renderStars(5)}</div>
                    <button type="submit" className="bg-[#28cdba] text-white px-4 py-2 rounded-lg text-[12px] hover:bg-[#20a89a] transition-colors">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-6 text-[12px]">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{review.user.name}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - flex 1 */}
        <div className="flex-1 w-full md:w-1/4">
          <div className="bg-white rounded-2xl p-4 shadow-md sticky top-20">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activity.price_discount ? (
                  <>
                    <span className="text-sm text-gray-400 line-through block">Rp {activity.price}</span>
                    <span className="text-[#28cdba]">Rp {activity.price_discount}</span>
                  </>
                ) : (
                  <span className="text-[#28cdba]">Rp {activity.price}</span>
                )}
              </h2>
              <p className="text-sm text-gray-500 text-[12px]">per person</p>
            </div>

            {/* Date Picker */}
            <div className="mb-4 pb-4 border-b border-gray-100 text-[12px]">
              <label htmlFor="event-date" className="block text-gray-600 mb-2 font-medium text-sm">
                Select Date
              </label>
              <div className="relative">
                <input type="date" id="event-date" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#28cdba] focus:border-transparent" min={new Date().toISOString().split("T")[0]} />
              </div>
            </div>

            {/* Guest Counter */}
            <div className="mb-4 pb-4 border-b border-gray-100 text-[12px]">
              <label htmlFor="guest-count" className="block text-gray-600 mb-2 font-medium text-sm">
                Number of Guests
              </label>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    const input = document.getElementById("guest-count");
                    if (input.value > 1) input.value = Number(input.value) - 1;
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  id="guest-count"
                  className="w-full mx-2 text-center border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#28cdba] focus:border-transparent"
                  min="1"
                  max="10"
                  defaultValue="1"
                />
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    const input = document.getElementById("guest-count");
                    if (input.value < 10) input.value = Number(input.value) + 1;
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6 text-[12px]">
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <FaHeart className="text-red-500" size={16} />
                Favorite
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <FaShareAlt size={16} />
                Share
              </button>
            </div>

            {/* Book Now Button */}
            <button className="w-full bg-[#28cdba] text-white py-3 rounded-lg font-medium hover:bg-[#20a89a] transition-colors flex items-center justify-center gap-2">
              <FaShoppingCart size={16} />
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Container 2 - You May Also Like */}
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{relatedActivities.map((activity) => renderRelatedActivityCard(activity))}</div>
      </div>
    </div>
  );
}

export default ActivityDetail;

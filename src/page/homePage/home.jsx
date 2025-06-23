import { useEffect, useState, useRef } from "react";
import { MdSearch, MdChevronLeft, MdChevronRight, MdLocalOffer } from "react-icons/md";
import { AiOutlineStar, AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import ScrollableSection from "../../components/ScrollableSection";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/banner";
import axios from "axios";

function Home() {
  const navigator = useNavigate();
  const token = localStorage.getItem("token");
  const [banner, setBanner] = useState([]);
  const [category, setCategory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [promo, setpromo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const responseBanner = await axios.get(" https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        const responseCat = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        const responseAct = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });
        const responsePromo = await axios.get(" https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        });

        setBanner(responseBanner.data.data);
        setCategory(responseCat.data.data);
        setActivity(responseAct.data.data);
        setpromo(responsePromo.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const renderCategoryItem = (cat, index) => (
    <div key={index} className="flex flex-col w-36 md:w-44 h-48 md:h-54 rounded-xl md:rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-32 md:h-40 w-full relative">
        <img src={cat.imageUrl} alt="alt" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-1.5 md:p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar size={14} />
            </button>
          </div>
          <div className="flex-1 flex items-end p-1.5 md:p-2 text-white">
            <p className="text-sm md:text-base font-medium">{cat.name}</p>
          </div>
        </div>
      </div>
      <div className="p-2 grow flex items-center gap-2 md:gap-3 justify-between">
        <p className="text-xs md:text-sm">Explore Category</p>
        <button onClick={() => navigator(`/category/${cat.id}`)} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] p-1 hover:bg-[#28cdba] hover:text-white transition-colors">
          <MdChevronRight size={12} />
        </button>
      </div>
    </div>
  );

  const renderActivityItem = (act, index) => (
    <div
      key={index}
      onClick={() => navigator(`/activity/${act.id}`)}
      className="flex flex-col h-64 md:h-70 w-52 md:w-60 rounded-xl md:rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="h-20 md:h-22 w-full relative">
        <img src={act.imageUrls} alt={act.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-1.5 md:p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 md:p-3 gap-1.5 md:gap-2 w-full grow">
        <h3 className="font-medium text-sm md:text-base line-clamp-1">{act.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <IoLocationOutline size={12} />
          <span className="line-clamp-1">{act.city ? `${act.city}, ${act.province}` : `${act.province}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <AiFillStar className="text-yellow-400" size={12} />
          <span className="text-xs">{`${act.rating} (${act.total_reviews} reviews)`}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{act.description}</p>
        <div className="flex items-end justify-between mt-1 grow">
          <div className="flex flex-col">
            {act.price_discount > 0 && <span className="text-xs text-gray-400 line-through">Rp {act.price}</span>}
            <span className="text-sm font-semibold text-[#28cdba]">Rp {act.price_discount || act.price}</span>
          </div>
          <button className="bg-[#28cdba] text-white p-1.5 md:p-2 rounded-full hover:bg-[#20a89a] transition-colors">
            <FaShoppingCart size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPromoItem = (promo, index) => (
    <div key={index} className="flex flex-col w-52 md:w-60 h-56 md:h-60 rounded-xl md:rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-28 md:h-30 w-full relative">
        <img src={promo.imageUrl} alt="promo" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex items-end p-1.5 md:p-2 text-white">
            <p className="text-sm md:text-base font-medium line-clamp-1">{promo.title}</p>
          </div>
        </div>
      </div>

      <div className="p-2 grow flex flex-col justify-between gap-1.5 md:gap-2">
        <div className="flex items-center gap-1 md:gap-1.5 bg-[#f0fbfa] p-1 md:p-1.5 rounded-lg">
          <MdLocalOffer className="text-[#28cdba]" size={14} />
          <p className="text-xs md:text-sm font-medium text-[#28cdba] line-clamp-1">{promo.promo_code}</p>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">{promo.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AiOutlineClockCircle className="text-gray-500" size={12} />
            <p className="text-xs text-gray-500">Expires in 10 days</p>
          </div>

          <button onClick={() => navigator(`/promo/${promo.id}`)} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] p-1 hover:bg-[#28cdba] hover:text-white transition-colors">
            <MdChevronRight size={12} />
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
          <p className="text-gray-600">Loading home page...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* hero section */}
      <div className="h-[calc(100vh-52px)] min-h-[500px] relative">
        <div className="w-full h-full brightness-70">
          <img src="/home.jpg" alt="jumbotron" className="w-full h-full object-cover" />
        </div>
        <div className="absolute w-full h-full top-0 left-0 items-center justify-center flex flex-col gap-4 md:gap-6 px-4">
          <h2 className="text-white font-bold text-2xl md:text-4xl text-center">
            Start Here. Begin Your
            <br />
            <span className="text-[#28cdba]">Journey</span>
          </h2>
          <p className="text-sm md:text-base text-white text-center max-w-md">Temukan destinasi impianmu, pesan tiket dengan mudah, dan ciptakan kenangan seumur hidup.</p>
          <div className="w-full max-w-4xl px-4 md:px-10 py-3 rounded-2xl md:rounded-full flex flex-col bg-[rgba(232,232,232,0.4)] backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:items-end">
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs md:text-[10px] text-white">What are you looking for?</p>
                <div className="flex px-3 md:px-2 h-10 md:h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Activities" onChange={""} value={""} className="outline-none w-full md:w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs md:text-[10px] text-white">Where?</p>
                <div className="flex px-3 md:px-2 h-10 md:h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Location" onChange={""} value={""} className="outline-none w-full md:w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs md:text-[10px] text-white">When?</p>
                <div className="flex px-3 md:px-2 h-10 md:h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Date" onChange={""} value={""} className="outline-none w-full md:w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs md:text-[10px] text-white">Guest?</p>
                <div className="flex px-3 md:px-2 h-10 md:h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Guests" onChange={""} value={""} className="outline-none w-full md:w-20" />
                </div>
              </div>
              <button className="bg-[#28cdba] text-white border-none h-10 md:h-8 rounded-lg px-4 md:px-4 text-sm md:text-xs font-medium hover:bg-[#20a89a] transition-colors">Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* banner */}
      <Banner banner={banner} />

      {/* overview categories */}
      <ScrollableSection title="Explore Categories" description="From tropical escapes to thrilling adventures — start exploring now." data={category} renderItem={renderCategoryItem} navigation="/category" bgColor="bg-[#eafffd]" />

      {/* overview activities */}
      <ScrollableSection title="Popular Activities" description="Start your journey with top-rated activities around the world." data={activity} renderItem={renderActivityItem} navigation="/activity" bgColor="bg-white" />

      {/* overview promo */}
      <ScrollableSection title="Special Promos" description="Exclusive deals and discounts for your next adventure." data={promo} renderItem={renderPromoItem} navigation="/promo" bgColor="bg-[#f5f5f5]" />
    </>
  );
}

export default Home;

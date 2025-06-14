import { useEffect, useState, useRef } from "react";
import { MdSearch, MdChevronLeft, MdChevronRight, MdLocalOffer } from "react-icons/md";
import { AiOutlineStar, AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import ScrollableSection from "../../components/ScrollableSection";
import Banner from "../../components/banner";
import axios from "axios";

function Home() {
  const token = localStorage.getItem("token");
  const [banner, setBanner] = useState([]);
  const [category, setCategory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [promo, setpromo] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
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
      } catch (err) {
        console.log(err.response);
      }
    };

    getData();
  }, []);

  const renderCategoryItem = (cat, index) => (
    <div key={index} className="flex flex-col w-44 h-54 rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 w-full relative">
        <img src={cat.imageUrl} alt="alt" className="w-full h-full object-cover" />
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
        <button onClick={""} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] text-[8px]">
          <MdChevronRight size={12} />
        </button>
      </div>
    </div>
  );

  const renderActivityItem = (act, index) => (
    <div key={index} className="flex flex-col h-70 w-60 rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-22 w-full relative">
        <img src={act.imageUrls} alt={act.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex justify-end items-start p-2">
            <button className="border-none rounded-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg p-1 text-[#28cdba]">
              <AiOutlineStar />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-3 gap-2 w-full grow">
        <h3 className="font-medium text-base">{act.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <IoLocationOutline size={14} />
          <span>{act.city ? `${act.city}, ${act.province}` : `${act.province}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <AiFillStar className="text-yellow-400" size={14} />
          <span className="text-xs">{`${act.rating} (${act.total_reviews} reviews)`}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{act.description}</p>
        <div className="flex items-end justify-between mt-1 grow">
          <div className="flex flex-col">
            {act.price_discount && <span className="text-xs text-gray-400 line-through">Rp {act.price}</span>}
            <span className="text-sm font-semibold text-[#28cdba]">Rp {act.price_discount || act.price}</span>
          </div>
          <button className="bg-[#28cdba] text-white p-2 rounded-full hover:bg-[#20a89a] transition-colors">
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPromoItem = (promo, index) => (
    <div key={index} className="flex flex-col w-44 h-64 rounded-2xl bg-white flex-shrink-0 overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 w-full relative">
        <img src={promo.imageUrl} alt="promo" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1 flex items-end p-2 text-white">
            <p>{promo.title}</p>
          </div>
        </div>
      </div>

      <div className="p-2 grow flex flex-col justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-[#f0fbfa] p-1.5 rounded-lg">
          <MdLocalOffer className="text-[#28cdba]" size={16} />
          <p className="text-[14px] font-medium text-[#28cdba]">{promo.promo_code}</p>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">{promo.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AiOutlineClockCircle className="text-gray-500" size={12} />
            <p className="text-[12px] text-gray-500">Expires in 10 days</p>
          </div>

          <button onClick={""} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] text-[8px]">
            <MdChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* hero section */}
      <div className="h-[calc(100vh-52px)] relative">
        <div className="w-full h-full brightness-70">
          <img src="/home.jpg" alt="jumbotron" className="w-full h-full object-cover" />
        </div>
        <div className="absolute w-full h-full top-0 left-0 items-center justify-center flex flex-col gap-6">
          <h2 className="text-white font-bold text-4xl text-center">
            Start Here. Begin Your
            <br />
            <p className="text-[#28cdba]">Journey</p>
          </h2>
          <p className="text-[14px] text-white text-center">
            Temukan destinasi impianmu, pesan tiket dengan mudah, <br /> dan ciptakan kenangan seumur hidup.
          </p>
          <div className="px-10 py-3 rounded-full  flex flex-col bg-[rgba(232,232,232,0.4)] backdrop-blur-sm">
            <div className="flex gap-3 items-end">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-white">What are you looking for?</p>
                <div className="flex px-2 h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Activities" onChange={""} value={""} className="outline-none w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-white">Where?</p>
                <div className="flex px-2 h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Activities" onChange={""} value={""} className="outline-none w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-white">When?</p>
                <div className="flex px-2 h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Activities" onChange={""} value={""} className="outline-none w-20" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-white">Guest?</p>
                <div className="flex px-2 h-8 bg-white gap-1 items-center rounded-lg text-[#28cdba]">
                  <MdSearch />
                  <input type="text" placeholder="Activities" onChange={""} value={""} className="outline-none w-20" />
                </div>
              </div>
              <button className="bg-[#28cdba] text-white border-none h-8 rounded-lg px-4 text-[12px]">Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* banner */}
      <Banner banner={banner} />

      {/* overview categories */}
      <ScrollableSection title="Explore Categories" description="From tropical escapes to thrilling adventures — start exploring now." data={category} renderItem={renderCategoryItem} bgColor="bg-[#eafffd]" />

      {/* overview activities */}
      <ScrollableSection title="Popular Activities" description="Start your journey with top-rated activities around the world." data={activity} renderItem={renderActivityItem} bgColor="bg-white" />

      {/* overview promo */}
      <ScrollableSection title="Special Promos" description="Exclusive deals and discounts for your next adventure." data={promo} renderItem={renderPromoItem} bgColor="bg-[#f5f5f5]" />
    </>
  );
}

export default Home;

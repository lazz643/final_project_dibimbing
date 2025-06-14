import React, { useRef, useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle, AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Banner({ banner }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.offsetWidth;
      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="mt-5 w-full h-[calc(100vh-52px)] relative">
      <div ref={scrollRef} className="w-full h-full flex rounded-3xl overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {banner.map((bann, index) => (
          <div key={index} className="relative overflow-hidden min-w-full w-full flex-shrink-0 snap-center">
            <img src={bann.imageUrl} alt="banner" className="w-full h-full object-cover" />
            <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-r from-black/80 to-black/20">
              <div className="w-[35%] h-full flex flex-col justify-center px-20 gap-2">
                <p className="font-bold text-3xl text-white">{bann.name}</p>
                <div className="flex gap-3.5 text-sm">
                  <div className="flex gap-1 items-center">
                    <IoLocationOutline className="text-[#28cdba] " />
                    <p className="text-white">indonesia</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <AiOutlineClockCircle className="text-[#28cdba]" />
                    <p className="text-white">3 days</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <AiFillStar className="text-[#28cdba]" />
                    <p className="text-white">4.8 (200)</p>
                  </div>
                </div>
                <p className="text-white text-sm">Great for families, solo travelers, and friends looking to explore and enjoy.</p>
                <div className="flex flex-col">
                  <p className="text-2xl font-bold text-white">Rp 999.000</p>
                  <p className="text-white text-[10px]">* Price per Person</p>
                </div>
                <button className="mt-2 rounded-md max-w-max py-1 px-3 bg-[#28cdba] text-white text-[12px]">Explore Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol navigasi kiri */}
      <button onClick={scrollLeft} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10">
        <IoIosArrowBack size={24} />
      </button>

      {/* Tombol navigasi kanan */}
      <button onClick={scrollRight} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10">
        <IoIosArrowForward size={24} />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {banner.map((_, index) => (
          <div key={index} className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${index === activeIndex ? "bg-[#28cdba]" : "bg-white opacity-70"}`} onClick={() => scrollToIndex(index)}></div>
        ))}
      </div>
    </div>
  );
}

export default Banner;

import { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function ScrollableSection({ title, description, data, renderItem, bgColor = "bg-white" }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className={`px-96 py-20 ${bgColor}`}>
      <div className="flex flex-col gap-2">
        <div className="">
          <p className="text-[20px] font-bold text-[#28cdba]">{title}</p>
          <p className="text-[12px]">{description}</p>
        </div>
        <div ref={scrollContainerRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="flex gap-4 overflow-x-auto py-4 px-1">
          {data.map((item, index) => renderItem(item, index))}
        </div>
        <div className="flex justify-end gap-3">
          <div className="flex gap-1">
            <button onClick={scrollLeft} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] text-[8px]">
              <MdChevronLeft size={18} />
            </button>
            <button onClick={scrollRight} className="border-2 border-[#28cdba] rounded-full text-[#28cdba] text-[8px]">
              <MdChevronRight size={18} />
            </button>
          </div>
          <button className="border-none rounded-lg bg-[#28cdba] text-[10px] text-white px-3">View All</button>
        </div>
      </div>
    </div>
  );
}

export default ScrollableSection;

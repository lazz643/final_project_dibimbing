import { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ScrollableSection({ title, description, data, renderItem, bgColor = "bg-white", navigation }) {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

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
    <div className={`px-4 sm:px-8 md:px-16 lg:px-32 xl:px-96 py-12 md:py-20 ${bgColor}`}>
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-center md:text-left">
          <p className="text-lg md:text-xl font-bold text-[#28cdba] mb-1">{title}</p>
          <p className="text-sm md:text-xs text-gray-600 max-w-2xl mx-auto md:mx-0">{description}</p>
        </div>
        <div ref={scrollContainerRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="flex gap-3 md:gap-4 overflow-x-auto py-4 px-1 -mx-1">
          {data.map((item, index) => renderItem(item, index))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 items-center">
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="border-2 border-[#28cdba] rounded-full text-[8px] text-[#28cdba]  hover:bg-[#28cdba] hover:text-white transition-colors">
              <MdChevronLeft size={18} />
            </button>
            <button onClick={scrollRight} className="border-2 border-[#28cdba] rounded-full text-[8px] text-[#28cdba]  hover:bg-[#28cdba] hover:text-white transition-colors">
              <MdChevronRight size={18} />
            </button>
          </div>
          <button onClick={() => navigate(navigation)} className="border-none rounded-lg bg-[#28cdba] text-sm md:text-xs text-white px-4 py-2 md:px-3 md:py-1 hover:bg-[#20a89a] transition-colors font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScrollableSection;

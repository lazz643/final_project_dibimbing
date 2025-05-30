import { useContext } from "react";
import { SearchContext } from "../searchContext/SearchContext";
import { MdSearch } from "react-icons/md";

function Search() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  return (
    <div className="flex bg-gray-100 rounded-lg px-2 gap-1 w-max items-center text-purple-500">
      <MdSearch />
      <input type="text" placeholder="search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="outline-none py-0.5 w-30" />
    </div>
  );
}

export default Search;

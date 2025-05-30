import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../searchContext/SearchContext";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [dataUser, setDataUser] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMax] = useState(0);
  const navigate = useNavigate();
  const [filteredUser, setFilteredUser] = useState([]);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    // get data user
    const getDataUser = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${page}`, {
          headers: {
            "x-api-key": "reqres-free-v1",
          },
        });
        setDataUser(response.data.data);
        setMax(response.data.total_pages);
        console.log(response);
        console.log("token:", token);
      } catch (err) {
        console.log(err.response);
      }
    };

    getDataUser();
  }, [page]);

  useEffect(() => {
    const filtered = dataUser.filter((user) => `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredUser(filtered);
  }, [searchQuery, dataUser]);

  return (
    <div className="bg-gray-100 rounded-lg px-6 py-3 mt-4 flex flex-col gap-5">
      <div className="flex justify-between">
        <h2 className="text-purple-500 font-bold text-[24px]">User Data List</h2>
        <button className="font-bold px-4 border-1 bg-purple-100 border-purple-500 rounded-lg text-[12px] text-purple-500 hover:bg-purple-500 hover:text-white">Add</button>
      </div>
      <ul className="flex flex-wrap gap-6 w-full">
        {/* Card user list */}
        {filteredUser.map((data) => (
          <li key={data.id} className="bg-white w-[220px] h-[256px] rounded-xl shadow-lg flex flex-col overflow-hidden hover:scale-105 transition-all">
            <div className="h-[55%]">
              <img src={data.avatar} alt="imgUser" className="w-full h-full object-cover" />
            </div>
            <div className="p-2 flex flex-col">
              <h3 className="text-[14px]">
                Name: {data.first_name} {data.last_name}
              </h3>
              <h3 className="text-[14px]">Email: {data.email}</h3>
              <button onClick={() => navigate(`/dashboard/${data.id}`)} className="w-[100px] border-[2px] border-purple-500 rounded-xl self-center text-[14px] text-purple-500 mt-4 hover:bg-purple-500 hover:text-white cursor-pointer">
                View detail
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-1 justify-end">
        <button disabled={page <= 1} className={`px-4 py-1  rounded-lg text-[12px] text-white cursor-pointer  ${page <= 1 ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-400"}`} onClick={() => setPage((prev) => prev - 1)}>
          Prev
        </button>
        <button disabled={page >= maxPage} className={`px-4 py-1  rounded-lg text-[12px] text-white cursor-pointer  ${page >= maxPage ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-400"}`} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

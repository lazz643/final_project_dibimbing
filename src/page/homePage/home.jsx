import { useEffect, useState, useRef } from "react";
import { MdSearch } from "react-icons/md";
import axios from "axios";

function Home() {
  const token = localStorage.getItem("token");
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    const getDataUser = async () => {
      try {
        const response = await axios.get("https://reqres.in/api/users?page=1");
        setDataUser(response.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    getDataUser();
  }, []);

  return (
    <>
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
    </>
  );
}

export default Home;

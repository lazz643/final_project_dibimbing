import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Detail() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users/${id}`, {
          headers: {
            "x-api-key": "reqres-free-v1",
          },
        });
        console.log(response);
        setData(response.data.data);
      } catch (err) {
        console.log(err.response);
        console.log(id);
      }
    };
    getData();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg px-6 py-3 mt-4 flex flex-col sm:flex-row gap-5">
      <div className="flex-1 p-2">
        <div className="flex aspect-square w-full rounded-xl overflow-hidden ">
          <img src={data.avatar} alt="profil" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-3 flex-wrap flex flex-col">
        <label className="mt-3">First name</label>
        <input placeholder={data.first_name} className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled />
        <label className="mt-2">Last name</label>
        <input placeholder={data.last_name} className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled />
        <label className="mt-2">Email</label>
        <input placeholder={data.email} className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled />
        <label className="mt-2">Password</label>
        <input placeholder="*****" className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled />
        <label className="mt-2">No telp</label>
        <input placeholder="0812" className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled />
        <label className="mt-2">Address</label>
        <textarea rows="4" placeholder="Address" className="flex p-1.5 border-purple-500 border-2 rounded-xl w-full" disabled></textarea>
      </div>
    </div>
  );
}

export default Detail;

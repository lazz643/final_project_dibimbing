import React, { useState } from "react";
import axios from "axios";

function Regis({ menu }) {
  const [dataRegis, setDataRegis] = useState({ email: "", pass: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const isDisable = !dataRegis.email || !dataRegis.pass;

  const handleRegis = async () => {
    const payload = {
      email: dataRegis.email,
      password: dataRegis.pass,
    };

    try {
      const response = await axios.post("https://reqres.in/api/register", payload, {
        headers: {
          "x-api-key": "reqres-free-v1",
        },
      });
      console.log(response);
      setSuccess("Register success");

      setTimeout(() => {
        menu();
      }, 2000);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegis();
      }}
    >
      <div className="flex flex-col">
        <label htmlFor="inputEmail">Email</label>
        <input type="text" placeholder="email" name="email" id="inputEmail" onChange={(e) => setDataRegis({ ...dataRegis, email: e.target.value })} value={dataRegis.email} required className="p-1 border-1 rounded-md border-gray-300" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="inputPass">Password</label>
        <input type="password" placeholder="password" name="pass" id="inputPass" onChange={(e) => setDataRegis({ ...dataRegis, pass: e.target.value })} value={dataRegis.pass} required className="p-1 border-1 rounded-md border-gray-300" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button type="submit" disabled={isDisable} className={` rounded-sm p-1 text-white cursor-pointer  mt-8 ${isDisable ? "bg-gray-400" : "bg-[#28cdba] hover:bg-[#28cdba] hover:brightness-110"}`}>
        Register
      </button>
    </form>
  );
}

export default Regis;

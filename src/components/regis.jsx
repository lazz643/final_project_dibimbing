import React, { useState } from "react";
import axios from "axios";

function Regis({ menu }) {
  const [dataRegis, setDataRegis] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "admin",
    profilePictureUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
    phoneNumber: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Validasi form
  const isDisable = !dataRegis.name || !dataRegis.email || !dataRegis.password || !dataRegis.passwordRepeat || dataRegis.password !== dataRegis.passwordRepeat || !dataRegis.phoneNumber;

  const handleRegis = async () => {
    if (dataRegis.password !== dataRegis.passwordRepeat) {
      setError("Password tidak cocok");
      return;
    }

    const payload = {
      name: dataRegis.name,
      email: dataRegis.email,
      password: dataRegis.password,
      passwordRepeat: dataRegis.passwordRepeat,
      role: dataRegis.role,
      profilePictureUrl: dataRegis.profilePictureUrl,
      phoneNumber: dataRegis.phoneNumber,
    };

    try {
      setError("");
      setSuccess("");
      const response = await axios.post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register", payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      });
      console.log(response);
      setSuccess("Register berhasil");

      setTimeout(() => {
        menu();
      }, 2000);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Register gagal");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataRegis({ ...dataRegis, [name]: value });
  };

  return (
    <form
      className="flex flex-col gap-1 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegis();
      }}
    >
      <div className="flex flex-col mb-1">
        <label htmlFor="inputName" className="text-sm font-medium ">
          Nama
        </label>
        <input
          type="text"
          placeholder="Masukkan nama"
          name="name"
          id="inputName"
          onChange={handleChange}
          value={dataRegis.name}
          required
          className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]"
        />
      </div>

      <div className="flex flex-col mb-1">
        <label htmlFor="inputEmail" className="text-sm font-medium ">
          Email
        </label>
        <input
          type="email"
          placeholder="Masukkan email"
          name="email"
          id="inputEmail"
          onChange={handleChange}
          value={dataRegis.email}
          required
          className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]"
        />
      </div>

      <div className="flex flex-col mb-1">
        <label htmlFor="inputPass" className="text-sm font-medium ">
          Password
        </label>
        <input
          type="password"
          placeholder="Masukkan password"
          name="password"
          id="inputPass"
          onChange={handleChange}
          value={dataRegis.password}
          required
          className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]"
        />
      </div>

      <div className="flex flex-col mb-1">
        <label htmlFor="inputPassRepeat" className="text-sm font-medium ">
          Konfirmasi Password
        </label>
        <input
          type="password"
          placeholder="Konfirmasi password"
          name="passwordRepeat"
          id="inputPassRepeat"
          onChange={handleChange}
          value={dataRegis.passwordRepeat}
          required
          className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]"
        />
      </div>

      <div className="flex flex-col mb-1">
        <label htmlFor="inputPhone" className="text-sm font-medium ">
          Nomor Telepon
        </label>
        <input
          type="tel"
          placeholder="Masukkan nomor telepon"
          name="phoneNumber"
          id="inputPhone"
          onChange={handleChange}
          value={dataRegis.phoneNumber}
          required
          className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]"
        />
      </div>

      <div className="flex flex-col mb-1">
        <label htmlFor="inputRole" className="text-sm font-medium ">
          Role
        </label>
        <select name="role" id="inputRole" onChange={handleChange} value={dataRegis.role} className="p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#28cdba]">
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {success && <p className="text-green-500 text-xs mt-1">{success}</p>}

      <button type="submit" disabled={isDisable} className={`rounded-md p-2 text-white cursor-pointer mt-4 text-sm font-medium ${isDisable ? "bg-gray-400" : "bg-[#28cdba] hover:bg-[#28cdba] hover:brightness-110"}`}>
        Register
      </button>
    </form>
  );
}

export default Regis;

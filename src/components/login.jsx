import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [dataLogin, setDataLogin] = useState({ email: "", pass: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isDisable = !dataLogin.email || !dataLogin.pass;

  const handleLogin = async () => {
    const payload = {
      email: dataLogin.email,
      password: dataLogin.pass,
    };

    try {
      setError("");
      setSuccess("");
      const response = await axios.post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login", payload, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      });

      // Simpan token dan data user ke localStorage
      localStorage.setItem("token", response.data.token);

      // Simpan data user ke localStorage
      const userData = {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        profilePictureUrl: response.data.data.profilePictureUrl,
        phoneNumber: response.data.data.phoneNumber,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      setSuccess("Login success");

      setTimeout(() => {
        navigate("/");
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
        handleLogin();
      }}
    >
      <div className="flex flex-col">
        <label htmlFor="inputEmail" className="text-sm font-medium">
          Email
        </label>
        <input type="text" placeholder="email" name="email" id="inputEmail" onChange={(e) => setDataLogin({ ...dataLogin, email: e.target.value })} value={dataLogin.email} required className="p-1 border-1 rounded-md border-gray-300" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="inputPass" className="text-sm font-medium">
          Password
        </label>
        <input type="password" placeholder="password" name="pass" id="inputPass" onChange={(e) => setDataLogin({ ...dataLogin, pass: e.target.value })} value={dataLogin.pass} required className="p-1 border-1 rounded-md border-gray-300" />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {success && <p className="text-green-500 text-xs mt-1">{success}</p>}
      <button type="submit" disabled={isDisable} className={`rounded-sm p-1 text-white cursor-pointer mt-8 ${isDisable ? "bg-gray-400 cursor-not-allowed" : "bg-[#28cdba] hover:bg-[#28cdba] hover:brightness-110"}`}>
        Login
      </button>
    </form>
  );
}

export default Login;

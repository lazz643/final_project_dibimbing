import { useEffect, useState, useRef } from "react";
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
    <div>
      <div>home {token}</div>
    </div>
  );
}

export default Home;

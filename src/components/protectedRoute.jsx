import React from "react";
import { Navigate, useNavigation } from "react-router-dom";
import { Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  //   const navigate = useNavigation()
  //   useEffect(() => {
  //     if (!token) {
  //       navigate("/");
  //     }
  //   }, [token, navigate]);

  if (!token) {
    return <Navigate to="/" />;
  }
  return <>{children || Outlet}</>;
}

export default ProtectedRoute;

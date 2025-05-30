import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Front from "./page/front/front";
import Home from "./page/homePage/home";
import Dashboard from "./page/dashboard/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Detail from "./page/dashboard/[id]/detail";
import Layout from "./page/dashboard/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./searchContext/SearchContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Front />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SearchProvider>
                  <Layout />
                </SearchProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path=":id" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

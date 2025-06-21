import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Front from "./page/front/front";
import Home from "./page/homePage/home";
import Dashboard from "./page/dashboard/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Detail from "./page/dashboard/[id]/detail";
import CategoryPage from "./page/categoryPage/categoryPage";
import ActivityPage from "./page/activityPage/activityPage";
import ActivityDetail from "./page/activityPage/[id]";
import PromoDetail from "./page/promoPage/[id]";
import CategoryDetail from "./page/categoryPage/[id]";
import PromoPage from "./page/promoPage/promoPage";
import Cart from "./page/cart/cart";
import Transaction from "./page/transaction/transaction";
import TransactionDetail from "./page/transaction/detail";
import Layout from "./page/homePage/layout";
import Profile from "./page/profile/profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./searchContext/SearchContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/promo" element={<PromoPage />} />
            <Route path="/promo/:id" element={<PromoDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Front />} />
          <Route path="/front" element={<Front />} />
          {/* <Route
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
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

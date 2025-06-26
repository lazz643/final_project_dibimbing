import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Front from "./page/front/front";
import Home from "./page/homePage/home";
import ProtectedRoute from "./components/protectedRoute";
import CategoryPage from "./page/categoryPage/categoryPage";
import ActivityPage from "./page/activityPage/activityPage";
import ActivityDetail from "./page/activityPage/[id]";
import PromoDetail from "./page/promoPage/[id]";
import CategoryDetail from "./page/categoryPage/[id]";
import PromoPage from "./page/promoPage/promoPage";
import BannerPage from "./page/bannerPage/bannerPage";
import Cart from "./page/cart/cart";
import Transaction from "./page/transaction/transaction";
import TransactionDetail from "./page/transaction/detail";
import Layout from "./page/homePage/layout";
import Profile from "./page/profile/profile";
import Dashboard from "./page/dashboard/dashboard";
import AdminUsers from "./components/adminUsers";
import AdminOrder from "./components/adminOrder";
import AdminPromo from "./components/adminPromo";
import AdminBanner from "./components/adminBanner";
import AdminActivity from "./components/adminActivity";
import AdminCategories from "./components/adminCategories";
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
            <Route path="/banner/:id" element={<BannerPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <AdminOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/promos"
              element={
                <ProtectedRoute>
                  <AdminPromo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/banners"
              element={
                <ProtectedRoute>
                  <AdminBanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/activities"
              element={
                <ProtectedRoute>
                  <AdminActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/categories"
              element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
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

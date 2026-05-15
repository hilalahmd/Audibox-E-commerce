import React from "react";
import Home from "./pages/core/Home";
import Products from "./pages/shop/Products";
import Cart from "./pages/checkout/Cart";
import Wishlist from "./pages/user/Wishlist";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/shop/ProductDetails";
import ScrollToTop from "./components/ui/ScrollToTop";
import User from "./pages/user/User";
import FourNotFour from "./pages/core/FourNotFour";
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/checkout/Payment";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess"; 
import Orders from "./pages/user/Orders";
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminStatsProvider } from "./context/admin/AdminStatsContext";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

// Framer Motion Global Animations
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/ui/PageTransition";

const App = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      
      {/* 🌟 AnimatePresence manages the mounting/unmounting of PageTransitions globally! */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* -------------------- Admin routes -------------------- */}
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />

          <Route
            path="/admin"
            element={
              <AdminStatsProvider>
                <PageTransition><AdminLayout /></PageTransition>
              </AdminStatsProvider>
            }
          >
            <Route path="dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="products" element={<PageTransition><AdminProducts /></PageTransition>} />
            <Route path="orders" element={<PageTransition><AdminOrders /></PageTransition>} />
            <Route path="users" element={<PageTransition><AdminUsers /></PageTransition>} />
          </Route>

          {/* -------------------- User storefront routes -------------------- */}
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
          <Route path="/user/:id" element={<PageTransition><User /></PageTransition>} />

          {/* Routes that require an authenticated user */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <PageTransition><Checkout /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout-success"
            element={
              <ProtectedRoute>
                <PageTransition><CheckoutSuccess /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/stripe"
            element={
              <ProtectedRoute>
                <PageTransition><Payment /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <PageTransition><Orders /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<PageTransition><FourNotFour /></PageTransition>} />

          {/* Cart & wishlist */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <PageTransition><Cart /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <PageTransition><Wishlist /></PageTransition>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* React-Toastify UI config */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
      />
    </>
  );
};

export default App;

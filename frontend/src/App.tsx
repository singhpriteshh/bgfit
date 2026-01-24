import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Cart from "./features/cart/Cart";
import AddressSelection from "./features/checkout/AddressSelection";
import ProductDetails from "./features/shop/ProductDetails";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ShippingReturns from "./pages/ShippingReturns";
import FAQ from "./pages/FAQ";

import AdminLayout from "./layout/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getCurrentUser } from "./store/slices/authSlice";
import { fetchCart } from "./store/slices/cartSlice";

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Public Routes - Wrapped in MainLayout */}
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/address" element={<AddressSelection />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* Admin Routes - Standalone Layout */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

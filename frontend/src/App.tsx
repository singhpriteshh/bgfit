import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layout/MainLayout";

const Home = React.lazy(() => import("./pages/Home"));
const Shop = React.lazy(() => import("./pages/Shop"));
const Login = React.lazy(() => import("./features/auth/Login"));
const Register = React.lazy(() => import("./features/auth/Register"));
const Cart = React.lazy(() => import("./features/cart/Cart"));
const AddressSelection = React.lazy(
  () => import("./features/checkout/AddressSelection"),
);
const ProductDetails = React.lazy(
  () => import("./features/shop/ProductDetails"),
);

const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Profile = React.lazy(() => import("./pages/Profile"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const ShippingReturns = React.lazy(() => import("./pages/ShippingReturns"));
const FAQ = React.lazy(() => import("./pages/FAQ"));

const AdminLayout = React.lazy(() => import("./layout/AdminLayout"));
const AdminRoute = React.lazy(() => import("./components/AdminRoute"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const ProductManagement = React.lazy(
  () => import("./pages/admin/ProductManagement"),
);
const OrderManagement = React.lazy(
  () => import("./pages/admin/OrderManagement"),
);
const SiteSettings = React.lazy(() => import("./pages/admin/SiteSettings"));

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
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/address" element={<AddressSelection />} />
            <Route path="/shipping" element={<ShippingReturns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          {/* Admin Routes - Standalone Layout */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="settings" element={<SiteSettings />} />
              {/* Redirect /admin to /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

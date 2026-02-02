import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Home,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? "bg-indigo-600 text-white shadow-lg"
      : "text-gray-400 hover:bg-gray-800 hover:text-white";
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 w-64 h-full bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <Link
            to="/admin/dashboard"
            className="text-2xl font-bold font-display tracking-tighter text-white"
            onClick={closeSidebar}
          >
            BGFIT<span className="text-primary">.ADMIN</span>
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/dashboard",
            )}`}
            onClick={closeSidebar}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/products",
            )}`}
            onClick={closeSidebar}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/orders",
            )}`}
            onClick={closeSidebar}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">Orders</span>
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/settings",
            )}`}
            onClick={closeSidebar}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Site Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            onClick={closeSidebar}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Back to Shop</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 w-full">
        <div className="pt-12 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Home,
} from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? "bg-indigo-600 text-white shadow-lg"
      : "text-gray-400 hover:bg-gray-800 hover:text-white";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6">
          <Link
            to="/admin/dashboard"
            className="text-2xl font-bold font-display tracking-tighter text-white"
          >
            BGFIT<span className="text-primary">.ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/dashboard",
            )}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/products",
            )}`}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(
              "/admin/orders",
            )}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">Orders</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
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
      <main className="ml-64 flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

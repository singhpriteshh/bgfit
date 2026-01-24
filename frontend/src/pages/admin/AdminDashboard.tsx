import { useEffect, useState } from "react";
import api from "../../api/client";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Ideally create a specific dashboard stats endpoint
    // For now we can fetch all orders and products to calculate
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders/all"),
          api.get("/products"),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;

        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (order.total_amount || 0),
          0,
        );

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue: totalRevenue, // Assuming amount is in cents/sub-unit if applicable, or just RAW
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">Feature coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

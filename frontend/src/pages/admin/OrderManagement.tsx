import { useEffect, useState } from "react";
import api from "../../api/client";
import type { Order } from "../../types";
import { toast } from "react-toastify";
import { Eye, X } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/all");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchOrders(); // Refresh
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 bg-white border"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">
                    {order.shipping_full_name}
                  </div>
                  <div className="text-xs">{order.shipping_city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ₹{order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className="py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group relative"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order Details #{selectedOrder.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed on{" "}
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Summary & Address */}
                <div className="space-y-8">
                  <section>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Customer & Shipping Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-2">
                      <p>
                        <span className="font-semibold text-gray-900">
                          Name:
                        </span>{" "}
                        {selectedOrder.shipping_full_name}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Phone:
                        </span>{" "}
                        {selectedOrder.shipping_phone}
                      </p>
                      <div>
                        <span className="font-semibold text-gray-900 block mb-1">
                          Address:
                        </span>
                        <p className="text-gray-600">
                          {selectedOrder.shipping_address_line1}
                          {selectedOrder.shipping_address_line2 && (
                            <>
                              <br />
                              {selectedOrder.shipping_address_line2}
                            </>
                          )}
                          <br />
                          {selectedOrder.shipping_city},{" "}
                          {selectedOrder.shipping_state}{" "}
                          {selectedOrder.shipping_zip_code}
                          <br />
                          {selectedOrder.shipping_country}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Payment & Status
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-lg font-bold">
                          ₹{selectedOrder.total_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Current Status:
                        </span>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedOrder.status,
                          )}`}
                        >
                          {selectedOrder.status.toUpperCase()}
                        </span>
                      </div>
                      {/* Placeholder for Razorpay ID if it comes back from the API */}
                      <div className="pt-2 border-t border-gray-200 mt-2">
                        <p className="text-xs text-gray-500">
                          Payment Reference / Razorpay ID will appear here if
                          required.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Order Items */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-white shadow-sm"
                      >
                        <div className="w-20 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center font-medium">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900 line-clamp-2 leading-snug">
                              {item.product?.name || "Unknown Product"}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                              {item.color} | Size: {item.size}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{item.price}
                            </span>
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedOrder.items ||
                      selectedOrder.items.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No items found for this order.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

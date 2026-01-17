import { useEffect, useState } from "react";
import { Loader2, Package, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrders } from "../../store/slices/orderSlice";
import type { Order } from "../../types";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500">
          When you place an order, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">
                  Order Placed
                </p>
                <p className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">
                  Total
                </p>
                <p className="font-medium text-gray-900 text-sm">
                  ₹{order.total_amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">
                  Ship To
                </p>
                <p
                  className="font-medium text-gray-900 text-sm truncate max-w-[150px]"
                  title={order.shipping_full_name}
                >
                  {order.shipping_full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
              <button
                onClick={() => handleViewDetails(order)}
                className="text-sm font-medium text-primary hover:text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Order Id */}
            <p className="text-xs text-gray-400 mb-4 uppercase">
              Order ID: {order.id}
            </p>

            {/* Items Preview (Max 2) */}
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xs">
                          IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {item.product?.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-gray-900">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

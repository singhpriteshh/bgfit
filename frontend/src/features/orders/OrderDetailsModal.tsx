import { X, MapPin, Package, Calendar, CreditCard } from "lucide-react";
import type { Order } from "../../types";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              ID: <span className="font-mono">{order.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status & Date */}
          <div className="flex flex-wrap gap-4 justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Date Placed
                </p>
                <p className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Total Amount
                </p>
                <p className="font-medium text-gray-900">
                  ₹{order.total_amount}
                </p>
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                  order.status === "paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Shipping Address
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600 leading-relaxed shadow-sm">
              <p className="font-bold text-gray-900 text-base mb-1">
                {order.shipping_full_name}
              </p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && (
                <p>{order.shipping_address_line2}</p>
              )}
              <p>
                {order.shipping_city}, {order.shipping_state} -{" "}
                {order.shipping_zip_code}
              </p>
              <p>{order.shipping_country}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p>
                  <span className="font-medium text-gray-900">Phone:</span>{" "}
                  {order.shipping_phone}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" /> Items ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-20 w-20 shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xs bg-gray-100">
                        IMG
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.product?.name || "Product"}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Size:{" "}
                      <span className="font-medium text-gray-900">
                        {item.size}
                      </span>{" "}
                      | Color:{" "}
                      <span className="font-medium text-gray-900">
                        {item.color}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity} x ₹{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

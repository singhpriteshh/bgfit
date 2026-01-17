import { useState, useEffect } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/client";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchCart } from "../../store/slices/cartSlice";
import { checkout, clearCart } from "../../store/slices/cartSlice";
import { fetchProducts } from "../../store/slices/productSlice";

interface Address {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
}

export default function AddressSelection() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { items: products } = useAppSelector((state) => state.products);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "India",
    phone_number: "",
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
    dispatch(fetchCart());
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Address[]>("/addresses");
      setAddresses(res.data);
      // Automatically select default or first address
      if (res.data.length > 0) {
        const defaultAddr = res.data.find((a) => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : res.data[0].id);
      }
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<Address>("/addresses", newAddress);
      setAddresses([...addresses, res.data]);
      setSelectedAddressId(res.data.id);
      setIsAddingNew(false);
      toast.success("Address added successfully");
      // Reset form
      setNewAddress({
        full_name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "India",
        phone_number: "",
        is_default: false,
      });
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) return;

    // Calculate total logic here or reuse from store
    // Ideally total should come from valid cart state
    const total = items.reduce((sum, item) => {
      const product =
        item.product || products?.find((p) => p.id === item.product_id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    if (total <= 0) {
      toast.error("Cart is empty or invalid total");
      return;
    }

    setIsProcessingCheckout(true);
    dispatch(checkout({ totalAmount: total }))
      .unwrap()
      .then((order) => {
        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "BgFitStore",
          description: "Purchase",
          image: "/logo.png",
          order_id: order.id,
          handler: async function (response: any) {
            try {
              await api.post("/orders/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address_id: selectedAddressId,
              });
              dispatch(clearCart());
              toast.success("Order placed successfully!");
              navigate("/profile?tab=orders");
            } catch (error) {
              console.error(error);
              toast.error(
                "Payment verification failed. Please contact support.",
              );
            }
          },
          prefill: {
            name: selectedAddress.full_name,
            email: user?.email || "",
            contact: selectedAddress.phone_number,
          },
          theme: {
            color: "#4F46E5",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch((err) => {
        toast.error("Checkout failed: " + err);
      })
      .finally(() => {
        setIsProcessingCheckout(false);
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-8 uppercase">
        Select Delivery Address
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => setSelectedAddressId(addr.id)}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedAddressId === addr.id
                ? "border-black ring-2 ring-black ring-offset-2"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900">{addr.full_name}</span>
              {selectedAddressId === addr.id && (
                <Check className="h-5 w-5 text-black" />
              )}
            </div>
            <p className="text-gray-600">{addr.address_line1}</p>
            {addr.address_line2 && (
              <p className="text-gray-600">{addr.address_line2}</p>
            )}
            <p className="text-gray-600">
              {addr.city}, {addr.state} {addr.zip_code}
            </p>
            <p className="text-gray-600">{addr.country}</p>
            <p className="text-gray-600 mt-2 flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Phone:
              </span>
              {addr.phone_number}
            </p>
          </div>
        ))}

        <button
          onClick={() => setIsAddingNew(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors min-h-[200px]"
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="font-medium uppercase">Add New Address</span>
        </button>
      </div>

      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-display font-bold mb-6">
              Add New Address
            </h2>
            <form
              onSubmit={handleAddAddress}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.full_name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, full_name: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.address_line1}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      address_line1: e.target.value,
                    })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.address_line2}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      address_line2: e.target.value,
                    })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.zip_code}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip_code: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  required
                  type="text"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={newAddress.phone_number}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      phone_number: e.target.value,
                    })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium uppercase tracking-wide"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-8 border-t border-gray-200">
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedAddressId || isProcessingCheckout}
          className="flex items-center justify-center px-8 py-4 bg-black text-white rounded-md text-lg font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors shadow-lg"
        >
          {isProcessingCheckout ? (
            <>Processing...</>
          ) : (
            <>
              Proceed to Payment <Check className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchCart,
  removeFromCart,
  type CartState,
} from "../../store/slices/cartSlice";
import { fetchProducts } from "../../store/slices/productSlice";

// Extend global window for razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading: cartLoading } = useAppSelector(
    (state) => state.cart as CartState,
  );
  const { items: products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCart());
    if (products.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, products.length]);

  const total =
    items?.reduce((sum, item) => {
      const product =
        item.product || products?.find((p) => p.id === item.product_id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0) || 0;

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
      .unwrap()
      .then(() => toast.info("Item removed from cart"))
      .catch((err) => toast.error("Failed to remove item: " + err));
  };

  const handleCheckout = () => {
    // Navigate to address selection instead of direct checkout
    window.location.href = "/checkout/address";
    // using window.location for simplicity as useNavigate might require hook setup if not already clear,
    // but better to use useNavigate from react-router-dom if possible.
    // simpler:
    // navigate("/checkout/address");
  };

  if (cartLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-xl font-display text-gray-400">
          LOADING CART...
        </div>
      </div>
    );

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-3xl font-display font-medium text-gray-900 mb-2">
          YOUR CART IS EMPTY
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <a
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors uppercase tracking-wide font-display"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold mb-12 uppercase tracking-wider text-gray-900">
        Shopping Cart
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items */}
        <section className="lg:col-span-8">
          <ul className="border-t border-gray-200 divide-y divide-gray-200">
            {items.map((item) => {
              const product =
                item.product || products?.find((p) => p.id === item.product_id);
              return (
                <li key={item.id} className="flex py-8">
                  {/* Product Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 sm:h-32 sm:w-32 bg-gray-100">
                    {product ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        ?
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-display font-semibold text-gray-900 uppercase">
                            <a href={`/products/${item.product_id}`}>
                              {product?.name || `Product #${item.product_id}`}
                            </a>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500 border-r border-gray-200 pr-4 mr-4">
                            Size:{" "}
                            <span className="text-gray-900">{item.size}</span>
                          </p>
                          <p className="text-gray-500">
                            Color:{" "}
                            <span className="text-gray-900">{item.color}</span>
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-900 font-medium">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-xl font-medium text-gray-900">
                        ₹{product ? product.price * item.quantity : "..."}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Order Summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 shadow-sm border border-gray-100 sticky top-24"
        >
          <h2
            id="summary-heading"
            className="text-2xl font-display font-bold text-gray-900 uppercase tracking-wide"
          >
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order Total
              </dt>
              <dd className="text-2xl font-bold text-gray-900">₹{total}</dd>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center bg-gray-900 border border-transparent rounded-md py-4 px-8 text-base font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all font-display uppercase tracking-wider"
            >
              Proceed to Checkout
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Shipping and taxes calculated at checkout.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;

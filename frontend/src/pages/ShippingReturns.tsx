import { Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function ShippingReturns() {
  return (
    <div className="bg-white min-h-[60vh]">
      <SEO
        title="Shipping & Returns – BgFit.in | Free Delivery & Easy Returns"
        description="Learn about BgFit.in's shipping options, delivery times, and hassle-free 15-day return policy. Free standard shipping on orders above ₹999. Express delivery available."
        keywords="bgfit shipping, bgfit returns, free shipping India, 15 day return policy, exchange policy, delivery time, bgfit delivery, online shopping returns India"
      />
      {/* Header */}
      <div className="bg-gray-50 py-16 text-center border-b border-gray-200 px-4">
        <h1 className="text-4xl font-display font-bold text-gray-900 uppercase tracking-wide mb-4">
          Shipping & Returns
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Everything you need to know about getting your gear and our
          hassle-free return process.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Shipping Info
            </h2>
            <div className="space-y-6 text-gray-600">
              <div>
                <strong className="text-gray-900 block mb-1">
                  Standard Delivery
                </strong>
                <p>
                  7-14 business days. Free on orders above{" "}
                  <span className="font-bold">₹999</span>.
                </p>
              </div>
              <div>
                <strong className="text-gray-900 block mb-1">
                  Express Shipping
                </strong>
                <p>
                  1-2 business days. Available at checkout for{" "}
                  <span className="font-bold">₹150</span>.
                </p>
              </div>
              <div>
                <strong className="text-gray-900 block mb-1">
                  Order Tracking
                </strong>
                <p>
                  A tracking link will be sent to your email as soon as the
                  package leaves our warehouse.
                </p>
              </div>
            </div>
          </div>

          {/* Easy Returns */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6">
              <RotateCcw className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Easy Returns
            </h2>
            <div className="space-y-6 text-gray-600">
              <div>
                <strong className="text-gray-900 block mb-1">
                  15-Day Policy
                </strong>
                <p>
                  If it doesn't fit or you've changed your mind, return it
                  within 15 days.
                </p>
              </div>
              <div>
                <strong className="text-gray-900 block mb-1">Conditions</strong>
                <p>
                  Items must be in original condition, unwashed, with all tags
                  attached.
                </p>
              </div>
              <div>
                <strong className="text-gray-900 block mb-1">Refunds</strong>
                <p>
                  Once approved, your refund will be processed back to your
                  original payment method within 7-10 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-white shadow-xl shadow-primary/20">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Need a return label?
          </h3>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Contact our support team with your order ID to start a return.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-bold uppercase tracking-wide rounded hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

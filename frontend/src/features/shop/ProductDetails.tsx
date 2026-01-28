import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Share2, Ruler, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProductById } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    currentProduct: product,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState("M");
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      toast.info("Please login to add items to cart");
      return;
    }
    dispatch(
      addToCart({
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
        color: product.color,
      }),
    )
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch((err) => toast.error("Failed to add to cart: " + err));
  };

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-display text-xl tracking-wide">
        LOADING...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-display text-xl tracking-wide text-red-500">
        PRODUCT NOT FOUND
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors group text-sm font-medium uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image Gallery (Simple for now) */}
        <div className="space-y-4">
          <div className="aspect-4/5 w-full bg-gray-100 rounded-lg overflow-hidden relative shadow-md group">
            <img
              src={product.back_image_url || product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            />
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new_arrival && (
                <span className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                  New Drop
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* secondary images placeholder if we had them */}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              {product.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tighter uppercase leading-none">
            {product.name}
          </h1>
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Color */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
                Color: <span className="text-gray-500">{product.color}</span>
              </h3>
              <div className="flex gap-3">
                <button
                  className={`w-10 h-10 rounded-full border-2 ${
                    product.color === "Black"
                      ? "bg-black border-primary"
                      : "bg-gray-200 border-transparent hover:border-gray-300"
                  }`}
                ></button>
                {/* Fake other colors for demo visual */}
                <button className="w-10 h-10 rounded-full bg-blue-900 border-2 border-transparent hover:border-gray-300"></button>
                <button className="w-10 h-10 rounded-full bg-red-800 border-2 border-transparent hover:border-gray-300"></button>
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Size: <span className="text-gray-500">{selectedSize}</span>
                </h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="cursor-pointer text-xs text-gray-500 underline flex items-center gap-1 hover:text-primary"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-medium border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-500">
              <p>
                Engineered for peak performance, the {product.name} blends
                advanced moisture-wicking technology with a sleek, modern
                silhouette. Designed to move with you, whether you're crushing a
                PR or hitting the streets.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-4">
                <li>Premium moisture-wicking fabric</li>
                <li>Athletic fit for maximum mobility</li>
                <li>Reinforced stitching for durability</li>
                <li>Designed in Mumbai</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-secondary text-white py-4 px-8 font-display font-bold text-lg uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-3 group cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest">
                Free Shipping on orders above ₹999
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div
          onClick={() => setShowSizeChart(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            <div className="p-2">
              <img
                src="/images/sizechart.png"
                alt="Size Chart"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

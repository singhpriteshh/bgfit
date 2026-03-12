import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Ruler, X } from "lucide-react";
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

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Gallery slider state for mobile
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  // Auto-select first in-stock size when product loads
  useEffect(() => {
    if (product?.size_stocks) {
      const firstInStock = product.size_stocks.find((ss) => ss.stock > 0);
      if (firstInStock) {
        setSelectedSize(firstInStock.size);
      } else if (product.size_stocks.length > 0) {
        setSelectedSize(product.size_stocks[0].size);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      toast.info("Please login to add items to cart");
      return;
    }

    const sizeStock = product.size_stocks.find(
      (ss) => ss.size === selectedSize,
    );
    if (!sizeStock || sizeStock.stock <= 0) {
      toast.error(`Size ${selectedSize} is out of stock`);
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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    // Calculate which image is currently mostly visible
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  // Helper: check if all sizes are out of stock
  const isFullyOutOfStock =
    product?.size_stocks?.every((ss) => ss.stock <= 0) ?? true;

  // Helper: check if selected size is out of stock
  const isSelectedSizeOutOfStock = (() => {
    if (!product) return true;
    const sizeStock = product.size_stocks.find(
      (ss) => ss.size === selectedSize,
    );
    return !sizeStock || sizeStock.stock <= 0;
  })();

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
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative group">
            {/* Mobile Scroll Container / Desktop Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="aspect-4/5 w-full bg-gray-100 rounded-lg overflow-x-auto md:overflow-hidden relative shadow-md flex md:block snap-x snap-mandatory hide-scrollbar"
            >
              <div className="w-full shrink-0 snap-center md:absolute md:inset-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-opacity duration-500 md:opacity-100 ${
                    product.back_image_url ? "md:group-hover:opacity-0" : ""
                  }`}
                />
              </div>

              {product.back_image_url && (
                <div className="w-full shrink-0 snap-center md:absolute md:inset-0">
                  <img
                    src={product.back_image_url}
                    alt={`${product.name} back`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-opacity duration-500 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.is_new_arrival && (
                  <span className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    New Drop
                  </span>
                )}
                {isFullyOutOfStock && (
                  <span className="bg-red-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Slider Dots */}
            {product.back_image_url && (
              <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === 0 ? "w-4 bg-primary" : "w-1.5 bg-gray-300"}`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === 1 ? "w-4 bg-primary" : "w-1.5 bg-gray-300"}`}
                />
              </div>
            )}
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
          </div>

          <div className="space-y-8">
            {/* Color */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
                Color: <span className="text-gray-500">{product.color}</span>
              </h3>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Size:{" "}
                  <span className="text-gray-500">{selectedSize}</span>
                </h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="cursor-pointer text-xs text-gray-500 underline flex items-center gap-1 hover:text-primary"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.size_stocks.map((ss) => {
                  const isOutOfStock = ss.stock <= 0;
                  const isSelected = selectedSize === ss.size;

                  return (
                    <button
                      key={ss.size}
                      onClick={() => setSelectedSize(ss.size)}
                      disabled={isOutOfStock}
                      className={`py-3 px-5 text-sm font-medium border transition-all ${
                        isOutOfStock
                          ? "border-gray-100 text-gray-300 line-through cursor-not-allowed bg-gray-50"
                          : isSelected
                            ? "border-primary bg-primary text-white cursor-pointer"
                            : "border-gray-200 text-gray-900 hover:border-gray-400 cursor-pointer"
                      }`}
                    >
                      {ss.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-500">
              <p className="whitespace-pre-line">
                {product.product_description ||
                  `Engineered for peak performance, the ${product.name} blends advanced moisture-wicking technology with a sleek, modern silhouette. Designed to move with you, whether you're crushing a PR or hitting the streets.`}
              </p>
              {!product.product_description && (
                <ul className="list-disc pl-5 space-y-1 mt-4">
                  <li>Premium moisture-wicking fabric</li>
                  <li>Athletic fit for maximum mobility</li>
                  <li>Reinforced stitching for durability</li>
                  <li>Designed in Gujarat</li>
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="pt-8">
              <button
                onClick={handleAddToCart}
                disabled={isSelectedSizeOutOfStock}
                className={`w-full py-4 px-8 font-display font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 group transition-colors ${
                  isSelectedSizeOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-secondary text-white hover:bg-black cursor-pointer"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {isSelectedSizeOutOfStock ? "Out of Stock" : "Add to Cart"}
                </span>
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
                loading="lazy"
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

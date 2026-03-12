import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import type { Product } from "../types";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation

    // Pick first in-stock size or fallback
    const inStockSize = product.size_stocks.find((ss) => ss.stock > 0);
    if (!inStockSize) {
      toast.error("This product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        product_id: product.id,
        quantity: 1,
        size: inStockSize.size,
        color: product.color,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
      });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    // Calculate which image is currently mostly visible
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block relative">
        {/* Mobile Horizontal Scroll Container / Desktop Absolute Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative aspect-3/4 w-full overflow-x-auto md:overflow-hidden rounded-lg bg-gray-100 flex md:block snap-x snap-mandatory hide-scrollbar"
        >
          {/* Main Image */}
          <div className="w-full shrink-0 snap-center md:absolute md:inset-0">
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
                isHovered && product.back_image_url
                  ? "md:opacity-0"
                  : "opacity-100"
              }`}
            />
          </div>
          {/* Back Image (if available) */}
          {product.back_image_url && (
            <div className="w-full shrink-0 snap-center md:absolute md:inset-0">
              <img
                src={product.back_image_url}
                alt={`${product.name} back`}
                loading="lazy"
                className={`h-full w-full object-cover object-center transition-opacity duration-500 ${
                  isHovered ? "md:opacity-100" : "md:opacity-0"
                }`}
              />
            </div>
          )}

          {/* New Arrival Badge */}
          {product.is_new_arrival && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest z-10">
              New
            </span>
          )}

          {/* Quick Add Button - Always visible on mobile, Hover on Desktop */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-6 left-2 right-2 md:bottom-4 md:left-4 md:right-4 bg-white text-black py-2 md:py-3 px-2 md:px-4 uppercase text-[10px] md:text-xs font-bold tracking-widest shadow-lg opacity-100 translate-y-0 md:translate-y-full md:opacity-0 transition-all duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-black hover:text-white flex items-center justify-center gap-1 md:gap-2 z-10"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Add to Cart</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>

        {/* Mobile Slider Dots (Only show if there is a back image) */}
        {product.back_image_url && (
          <div className="absolute -bottom-3 left-0 right-0 flex md:hidden justify-center items-center gap-1 z-20 pointer-events-none">
            <div
              className={`h-1 rounded-full transition-all duration-300 shadow-sm border border-gray-100/10 ${activeIndex === 0 ? "w-3 bg-primary" : "w-1 bg-white/70"}`}
            />
            <div
              className={`h-1 rounded-full transition-all duration-300 shadow-sm border border-gray-100/10 ${activeIndex === 1 ? "w-3 bg-primary" : "w-1 bg-white/70"}`}
            />
          </div>
        )}
      </Link>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-base font-medium text-gray-900 hover:underline decoration-1 underline-offset-4">
              {product.name}
            </h3>
          </Link>
          <p className="text-base font-medium text-gray-900">
            ₹{product.price}
          </p>
        </div>
        <p className="text-sm text-gray-500 capitalize">
          {product.color} | {product.type}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

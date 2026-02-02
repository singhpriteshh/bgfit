import { useState } from "react";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    dispatch(
      addToCart({
        product_id: product.id,
        quantity: 1,
        size: "M",
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

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Main Image */}
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
              isHovered && product.back_image_url ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Back Image (if available) */}
          {product.back_image_url && (
            <img
              src={product.back_image_url}
              alt={`${product.name} back`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* New Arrival Badge */}
          {product.is_new_arrival && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest">
              New
            </span>
          )}

          {/* Quick Add Button - Appears on Hover */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 px-4 uppercase text-xs font-bold tracking-widest shadow-lg translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-black hover:text-white flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-3 w-3" />
            Add to Cart
          </button>
        </div>
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

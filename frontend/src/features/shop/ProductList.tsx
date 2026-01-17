import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductCard from "../../components/ProductCard";
import type { ProductFilters } from "../../store/slices/productSlice";

interface ProductListProps {
  filters?: ProductFilters;
  limit?: number;
}

const ProductList = ({ filters = {}, limit }: ProductListProps) => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Always fetch if filters are present, otherwise check if empty (or just refresh to be safe for now)
    // To solve the "frequent DB queries" issue while supporting filters, we can check if filters changed.
    // Ideally, we should fetch when filters change.
    dispatch(fetchProducts(filters));
  }, [dispatch, JSON.stringify(filters)]);

  const displayItems = limit ? items.slice(0, limit) : items;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit || 4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-3/4 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 xl:gap-x-8">
      {displayItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;

import { useSearchParams } from "react-router-dom";
import ProductList from "../features/shop/ProductList";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || undefined;
  const type = searchParams.get("type") || undefined;
  // Sort is not yet implemented in backend, but we can pass it
  const sort = searchParams.get("sort") || undefined;

  const filters = { category: gender, type, sort };

  const getTitle = () => {
    if (gender)
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`;
    if (type) return `${type} Collection`;
    return "All Products";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 uppercase tracking-wide">
            {getTitle()}
          </h1>
          <p className="mt-2 text-gray-500">
            {gender
              ? `Browse our premium collection for ${gender}.`
              : "Discover the latest trends in gym and street wear."}
          </p>
        </div>

        {/* Simple Filter Pills (Visual only for now, could be interactive links) */}
        <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0">
          {["All", "Men", "Women", "Unisex"].map((cat) => (
            <a
              key={cat}
              href={
                cat === "All" ? "/shop" : `/shop?gender=${cat.toLowerCase()}`
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (cat === "All" && !gender) || gender === cat.toLowerCase()
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      <ProductList filters={filters} />
    </div>
  );
};

export default Shop;

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "../features/shop/ProductList";
import api from "../api/client";
import type { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchSettings } from "../store/slices/shopSlice";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gender = searchParams.get("gender") || undefined;
  const type = searchParams.get("type") || undefined;

  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.shop);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Local state for filters
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile drawer state

  // Fetch all products to derive filters
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setAllProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products for filters", err);
      }
    };
    fetchAll();
  }, []);

  // Derive dynamic filters
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  const filters = {
    category: gender,
    type,
    sort,
    min_price: minPrice !== "" ? Number(minPrice) : undefined,
    max_price: maxPrice !== "" ? Number(maxPrice) : undefined,
    color: selectedColor || undefined,
  };

  const getTitle = () => {
    if (gender)
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`;
    if (type) return `${type} Collection`;
    return "All Products";
  };

  const colors = useMemo(() => {
    const uniqueColors = new Set(
      allProducts.map((p) => p.color).filter(Boolean),
    );
    return Array.from(uniqueColors);
  }, [allProducts]);

  const priceRanges = useMemo(() => {
    if (allProducts.length === 0) return [];
    const prices = allProducts.map((p) => p.price);
    const min = settings?.price_range_min ?? 0;
    const max = settings?.price_range_max ?? Math.max(...prices);
    const step = settings?.price_range_step ?? Math.ceil((max - min) / 5);

    const ranges = [];
    // Assuming we want roughly 5 ranges or based on step
    // If step is user defined, we can just iterate from min to max

    // Safety check to prevent infinite loop
    if (step <= 0) return [];

    let current = min;
    while (current < max) {
      const end = Math.min(current + step, max);
      ranges.push({
        label: `Rs. ${current} - Rs. ${end}`,
        min: current,
        max: end,
      });
      current += step;
      // Limit to reasonable number of ranges if step is too small
      if (ranges.length > 20) break;
    }

    return ranges;
  }, [allProducts, settings]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Sort Row */}
      <div className="relative z-20 border-b border-gray-200 pb-4 mb-6 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="text-gray-500 text-xs mb-1">
              Home / {gender ? gender : "Shop"}
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-800">
              {getTitle()}{" "}
              <span className="text-gray-400 text-lg font-normal mx-2">
                - {allProducts.length} items
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 md:w-64 p-2 border border-gray-300 text-sm shrink min-w-0 focus:outline-none focus:border-gray-500 rounded-sm"
            >
              <option value="newest">Sort by: Newest Arrivals</option>
              <option value="price_asc">Sort by: Price Low to High</option>
              <option value="price_desc">Sort by: Price High to Low</option>
            </select>
            <button
              className="md:hidden px-4 py-2 border border-gray-300 rounded-sm text-sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar - Reference Style */}
        <div
          className={`w-full md:w-64 shrink-0 space-y-8 ${isFilterOpen ? "block" : "hidden md:block"} md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:overflow-y-auto custom-scrollbar  pr-4`}
        >
          {/* Categories */}
          <div>
            <h3 className="font-bold uppercase text-xs text-gray-800 mb-4 tracking-wider">
              Categories
            </h3>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search for Categories"
                className="w-full text-sm p-2 border border-gray-200 rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400"
              />
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 border rounded-sm cursor-pointer ${
                    !gender ? "bg-primary border-primary" : "border-gray-300"
                  }`}
                  onClick={() =>
                    setSearchParams((prev) => {
                      const params = new URLSearchParams(prev);
                      params.delete("gender");
                      return params;
                    })
                  }
                ></div>
                <span className="flex-1 font-medium text-gray-900">All</span>
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.name}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary group"
                  onClick={() =>
                    setSearchParams((prev) => {
                      const params = new URLSearchParams(prev);
                      if (prev.get("gender") === cat.name) {
                        params.delete("gender");
                      } else {
                        params.set("gender", cat.name);
                      }
                      return params;
                    })
                  }
                >
                  <div
                    className={`w-4 h-4 border rounded-sm ${
                      gender === cat.name
                        ? "bg-primary border-primary"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  ></div>
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-gray-400 text-xs">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Price */}
          <div>
            <h3 className="font-bold uppercase text-xs text-gray-800 mb-4 tracking-wider">
              Prices
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {priceRanges.map((range, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => {
                    if (minPrice === range.min && maxPrice === range.max) {
                      setMinPrice("");
                      setMaxPrice("");
                    } else {
                      setMinPrice(range.min);
                      setMaxPrice(range.max);
                    }
                  }}
                >
                  <div
                    className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                      minPrice === range.min && maxPrice === range.max
                        ? "border-primary"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {minPrice === range.min && maxPrice === range.max && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={
                      minPrice === range.min && maxPrice === range.max
                        ? "text-gray-900 font-medium"
                        : ""
                    }
                  >
                    {range.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Colors */}
          <div>
            <h3 className="font-bold uppercase text-xs text-gray-800 mb-4 tracking-wider">
              Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? "" : color)
                  }
                  className={`w-6 h-6 rounded-full border transition-all ${
                    selectedColor === color
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Shop;

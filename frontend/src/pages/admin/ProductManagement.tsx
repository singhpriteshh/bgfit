import { useEffect, useState } from "react";
import api from "../../api/client";
import type { Product } from "../../types";
import { toast } from "react-toastify";
import { Edit2, Trash2, Plus, X, PlusCircle, MinusCircle } from "lucide-react";

interface SizeStockFormEntry {
  size: string;
  stock: string;
}

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  type: string;
  color: string;
  image_url: string;
  back_image_url: string;
  is_new_arrival: boolean;
  product_description: string;
  size_stocks: SizeStockFormEntry[];
}

const DEFAULT_SIZES: SizeStockFormEntry[] = [
  { size: "XS", stock: "0" },
  { size: "S", stock: "0" },
  { size: "M", stock: "0" },
  { size: "L", stock: "0" },
  { size: "XL", stock: "0" },
];

const initialFormState: ProductFormData = {
  name: "",
  price: "",
  category: "Men",
  type: "T-Shirt",
  color: "",
  image_url: "",
  back_image_url: "",
  is_new_arrival: false,
  product_description: "",
  size_stocks: [...DEFAULT_SIZES],
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate sizes — no empty size names, no duplicates
    const sizeNames = formData.size_stocks.map((ss) => ss.size.trim());
    if (sizeNames.some((s) => s === "")) {
      toast.error("Size name cannot be empty");
      setLoading(false);
      return;
    }
    if (new Set(sizeNames).size !== sizeNames.length) {
      toast.error("Duplicate size names are not allowed");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        type: formData.type,
        color: formData.color,
        image_url: formData.image_url,
        back_image_url: formData.back_image_url,
        is_new_arrival: formData.is_new_arrival,
        product_description: formData.product_description,
        size_stocks: formData.size_stocks.map((ss) => ({
          size: ss.size.trim(),
          stock: Number(ss.stock),
        })),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);
        toast.success("Product created successfully");
      }

      setIsModalOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      type: product.type,
      color: product.color,
      image_url: product.image_url,
      back_image_url: product.back_image_url || "",
      is_new_arrival: product.is_new_arrival,
      product_description: product.product_description || "",
      size_stocks: product.size_stocks.map((ss) => ({
        size: ss.size,
        stock: ss.stock.toString(),
      })),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ...initialFormState,
      size_stocks: [...DEFAULT_SIZES],
    });
    setEditingId(null);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image_url" | "back_image_url",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const toastId = toast.loading("Uploading image...");

    try {
      const response = await api.post("/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        [field]: response.data.url,
      }));
      toast.update(toastId, {
        render: "Image uploaded!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Upload failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Size stock management helpers
  const addSizeRow = () => {
    setFormData((prev) => ({
      ...prev,
      size_stocks: [...prev.size_stocks, { size: "", stock: "0" }],
    }));
  };

  const removeSizeRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      size_stocks: prev.size_stocks.filter((_, i) => i !== index),
    }));
  };

  const updateSizeRow = (
    index: number,
    field: "size" | "stock",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      size_stocks: prev.size_stocks.map((ss, i) =>
        i === index ? { ...ss, [field]: value } : ss,
      ),
    }));
  };

  // Helper: compute total stock for a product
  const getTotalStock = (product: Product) => {
    return product.size_stocks.reduce((sum, ss) => sum + ss.stock, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image_url}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.is_new_arrival && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      New Arrival
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-gray-900">
                      {getTotalStock(product)} total
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.size_stocks
                        .map((ss) => `${ss.size}:${ss.stock}`)
                        .join(" · ")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hoodie, T-Shirt"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    id="is_new_arrival"
                    type="checkbox"
                    checked={formData.is_new_arrival}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_new_arrival: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_new_arrival"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    New Arrival
                  </label>
                </div>
              </div>

              {/* Size-Specific Stock Management */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Size & Stock
                  </label>
                  <button
                    type="button"
                    onClick={addSizeRow}
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Size
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.size_stocks.map((ss, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Size (e.g. XXL)"
                        value={ss.size}
                        onChange={(e) =>
                          updateSizeRow(index, "size", e.target.value)
                        }
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        min="0"
                        value={ss.stock}
                        onChange={(e) =>
                          updateSizeRow(index, "stock", e.target.value)
                        }
                        className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => removeSizeRow(index)}
                        className="text-red-500 hover:text-red-700 shrink-0"
                        title="Remove size"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {formData.size_stocks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No sizes configured. Click "Add Size" to add one.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.product_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                  placeholder="Enter detailed description here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image_url")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      loading="lazy"
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Back Image (Optional)
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "back_image_url")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.back_image_url && (
                    <img
                      src={formData.back_image_url}
                      alt="Preview"
                      loading="lazy"
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

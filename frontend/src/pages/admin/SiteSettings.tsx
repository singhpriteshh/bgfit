import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSettings, updateSettings } from "../../store/slices/shopSlice";
import { toast } from "react-toastify";
import { Save, Plus, Trash2 } from "lucide-react";

interface SortingOption {
  label: string;
  value: string;
}

const SiteSettings = () => {
  const dispatch = useAppDispatch();
  const { settings, isLoading } = useAppSelector((state) => state.shop);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [priceStep, setPriceStep] = useState(1000);
  const [sortingOptions, setSortingOptions] = useState<SortingOption[]>([]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setPriceMin(settings.price_range_min);
      setPriceMax(settings.price_range_max);
      setPriceStep(settings.price_range_step);
      setSortingOptions(settings.sorting_options);
    }
  }, [settings]);

  const handleAddSortOption = () => {
    setSortingOptions([...sortingOptions, { label: "", value: "" }]);
  };

  const handleRemoveSortOption = (index: number) => {
    const newOptions = [...sortingOptions];
    newOptions.splice(index, 1);
    setSortingOptions(newOptions);
  };

  const handleSortOptionChange = (
    index: number,
    field: "label" | "value",
    newValue: string,
  ) => {
    const newOptions = [...sortingOptions];
    newOptions[index][field] = newValue;
    setSortingOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        updateSettings({
          price_range_min: priceMin,
          price_range_max: priceMax,
          price_range_step: priceStep,
          sorting_options: sortingOptions,
        }),
      ).unwrap();
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (!settings && isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Price Settings */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Price Filter Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Step (Interval)
              </label>
              <input
                type="number"
                value={priceStep}
                onChange={(e) => setPriceStep(Number(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
              />
            </div>
          </div>
        </div>

        {/* Sorting Settings */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Sorting Options
            </h2>
            <button
              type="button"
              onClick={handleAddSortOption}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-dark"
            >
              <Plus className="h-4 w-4" /> Add Option
            </button>
          </div>

          <div className="space-y-4">
            {sortingOptions.map((option, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Label (Visible to User)
                  </label>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleSortOptionChange(index, "label", e.target.value)
                    }
                    placeholder="e.g. Price: Low to High"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Value (Backend Key)
                  </label>
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleSortOptionChange(index, "value", e.target.value)
                    }
                    placeholder="e.g. price_asc"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border text-sm"
                  />
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveSortOption(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-5 w-5" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;

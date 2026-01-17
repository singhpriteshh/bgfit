import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile, getCurrentUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import {
  User as UserIcon,
  Mail,
  Camera,
  Save,
  Edit2,
  Lock,
  Phone,
  MapPin,
  Globe,
  Package,
} from "lucide-react";
import OrdersList from "../features/orders/OrdersList";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const location = window.location; // or useLocation from react-router
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });

  useEffect(() => {
    // Refresh user data on mount
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
        country: user.country || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const updateData: any = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zip_code,
      country: formData.country,
    };
    if (formData.password) {
      updateData.password = formData.password;
    }

    const resultAction = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "", confirm_password: "" }));
    } else {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8 uppercase tracking-tighter">
          My Account
        </h1>

        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> Profile
            </span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" /> My Orders
            </span>
          </button>
        </div>

        {activeTab === "orders" ? (
          <OrdersList />
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar Section */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-2 border-primary bg-gray-50 flex items-center justify-center text-primary shadow-sm relative group overflow-hidden">
                  <span className="text-5xl font-display font-bold uppercase">
                    {user?.full_name?.charAt(0)}
                  </span>
                  <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Member since {new Date().getFullYear()}
                </p>
              </div>

              {/* Info Section */}
              <div className="grow w-full">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-gray-900 uppercase tracking-tight">
                        {user?.full_name}
                      </h2>
                      <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </p>
                      {user?.phone_number && (
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4" />
                          {user.phone_number}
                        </p>
                      )}
                      {user?.address && (
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {user.address}, {user.city}, {user.state}{" "}
                          {user.zip_code}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-colors gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 animate-fade-in"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 border-b pb-2">
                          Personal Info
                        </h3>
                      </div>
                      {/* Full Name */}
                      <div className="md:col-span-1">
                        <label
                          htmlFor="full_name"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="md:col-span-1">
                        <label
                          htmlFor="email"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="phone_number"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone_number"
                            id="phone_number"
                            placeholder="+91"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 mt-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 border-b pb-2">
                          Shipping Address
                        </h3>
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="address"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Street Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans px-4"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans px-4"
                        />
                      </div>

                      {/* Zip */}
                      <div>
                        <label
                          htmlFor="zip_code"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                          className="block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans px-4"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Country
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 mt-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 border-b pb-2">
                          Security
                        </h3>
                      </div>

                      {/* Password Fields */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirm_password"
                          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
                        >
                          Confirm
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            placeholder="Confirm New Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="pl-10 block w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-none py-3 font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData((prev) => ({
                            ...prev,
                            full_name: user?.full_name || "",
                            email: user?.email || "",
                            phone_number: user?.phone_number || "",
                            address: user?.address || "",
                            city: user?.city || "",
                            state: user?.state || "",
                            zip_code: user?.zip_code || "",
                            country: user?.country || "",
                            password: "",
                            confirm_password: "",
                          }));
                        }}
                        className="px-6 py-3 border border-gray-300 text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-6 py-3 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary-dark transition-colors gap-2"
                      >
                        {isLoading ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

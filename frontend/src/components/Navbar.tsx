import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const { items } = useAppSelector((state: RootState) => state.cart);
  const location = useLocation();

  const isHome = location.pathname === "/";

  // Calculate total items
  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Dynamic classes for scroll effect
  const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled || !isHome
      ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
      : "bg-transparent py-4"
  }`;

  const linkClasses = `text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors relative group ${
    scrolled || !isHome ? "text-gray-800" : "text-white"
  }`;

  const iconClasses = `hover:text-primary transition-colors ${
    scrolled || !isHome ? "text-gray-800" : "text-white"
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo1.svg"
                alt="BGFIT Logo"
                className={`h-8 transition-all duration-300 ${
                  scrolled || !isHome
                    ? "mix-blend-multiply"
                    : "brightness-0 invert mix-blend-screen"
                }`}
              />
              <div
                className={`text-2xl font-bold font-display tracking-tighter ${
                  scrolled || !isHome ? "text-primary" : "text-white"
                }`}
              >
                BGFIT
                <span
                  className={
                    scrolled || !isHome ? "text-gray-900" : "text-gray-200"
                  }
                >
                  .IN
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop?gender=men" className={linkClasses}>
              Men
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/shop?gender=women" className={linkClasses}>
              Women
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/shop?gender=unisex" className={linkClasses}>
              Unisex
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/shop?sort=newest" className={linkClasses}>
              New Drops
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Utilities */}
          <div className="hidden md:flex items-center space-x-6">
            <button className={iconClasses}>
              <Search className="h-5 w-5 cursor-pointer" />
            </button>
            <Link to="/cart" className={`relative ${iconClasses}`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {token ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className={iconClasses}>
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className={iconClasses}>
                  <LogOut className="h-5 w-5 cursor-pointer" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 text-sm font-medium ${
                  scrolled || !isHome ? "text-gray-800" : "text-white"
                }`}
              >
                <User className="h-5 w-5" />
                <span>LOGIN</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${
                scrolled || !isHome ? "text-gray-800" : "text-white"
              } hover:text-primary transition-colors`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 absolute w-full top-full left-0 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/shop?gender=men"
              className="block px-3 py-3 rounded-md text-lg font-display uppercase tracking-wide text-gray-900 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Men
            </Link>
            <Link
              to="/shop?gender=women"
              className="block px-3 py-3 rounded-md text-lg font-display uppercase tracking-wide text-gray-900 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Women
            </Link>
            <Link
              to="/shop?gender=unisex"
              className="block px-3 py-3 rounded-md text-lg font-display uppercase tracking-wide text-gray-900 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Unisex
            </Link>
            <Link
              to="/shop?sort=newest"
              className="block px-3 py-3 rounded-md text-lg font-display uppercase tracking-wide text-gray-900 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              New Drops
            </Link>
            <div className="border-t border-gray-200 my-4"></div>
            <Link
              to="/cart"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
            {!token ? (
              <Link
                to="/login"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Login / Register
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <Link
              to="/"
              className="text-3xl font-bold font-display tracking-tighter text-white flex items-center gap-2"
            >
              <img
                src="/images/logo.png"
                alt="BGFIT Logo"
                className="h-8 w-auto invert mix-blend-screen"
              />
              <div>
                BGFIT<span className="text-primary">.IN</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining athletic wear with premium fabrics and modern cuts.
              Join the movement.
            </p>
            <div className="pt-4">
              <h4 className="font-display text-lg uppercase mb-4 tracking-wide">
                Join The Community
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-none text-white placeholder-gray-500 px-4 py-3 w-full focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary px-6 font-bold uppercase tracking-wider text-sm hover:bg-primary-dark transition-colors">
                  Join
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get 15% off your first order.
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-xl uppercase mb-6 tracking-wide text-gray-200">
              Shop
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  to="/shop?gender=men"
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?gender=women"
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?gender=unisex"
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?sort=newest"
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-xl uppercase mb-6 tracking-wide text-gray-200">
              Support
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-xl uppercase mb-6 tracking-wide text-gray-200">
              Get In Touch
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  123 Fitness Ave,
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@bgfit.in</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-8">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} BgFitStore. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-widest font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

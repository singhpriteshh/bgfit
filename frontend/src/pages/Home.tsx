import { Link } from "react-router-dom";
import ProductList from "../features/shop/ProductList";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            // src="/images/bg-hero.jpg"
            // alt="Hero background"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.4)] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-t from-secondary via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
            New Collection 2026
          </h2>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-8 tracking-tighter animate-fade-in-up animation-delay-200">
            FIT. STYLE.
            <br />
            COMFORT.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-400">
            Designed for everyday style. Premium fabrics that move with you,
            designed to turn heads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link
              to="/shop?sort=newest"
              className="bg-primary hover:bg-white hover:text-black text-white px-10 py-4 font-display font-bold text-lg uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1"
            >
              Shop New Drops
            </Link>
            <Link
              to="/shop"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 font-display font-bold text-lg uppercase tracking-wider transition-all duration-300"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Mission / Brand Section */}
      <div className="bg-secondary py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-primary font-display text-4xl md:text-5xl font-bold uppercase mb-8">
            Redefining Casual
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            We believe streetwear should be bold, resilient, and unapologetic.
            At <span className="text-white font-bold">BgFit.in</span>, we blend
            cutting-edge textile technology with street-ready aesthetics to
            create gear that looks good anywhere and feels even better.
          </p>
        </div>
      </div>

      {/* Categories Bento Box */}
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <h3 className="section-header text-center mb-16">Shop By Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Men's Card */}
          <Link
            to="/shop?gender=men"
            className="group relative h-[500px] overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1558954066-620ba460bae2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Men's Collection"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-display font-bold text-white uppercase mb-2">
                Men
              </h3>
              <span className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Women's Card */}
          <Link
            to="/shop?gender=women"
            className="group relative h-[500px] overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1681400150465-9845b135f018?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Women's Collection"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-display font-bold text-white uppercase mb-2">
                Women
              </h3>
              <span className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Unisex Card */}
          <Link
            to="/shop?gender=unisex"
            className="group relative h-[500px] overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Unisex Collection"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-display font-bold text-white uppercase mb-2">
                Unisex
              </h3>
              <span className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                Shop Everything <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Collection */}
      <div className="bg-gray-50 py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="section-header">Featured Drops</h3>
              <p className="text-gray-500 mt-2">
                Latest additions to our lineup.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-primary font-bold hover:text-secondary transition-colors underline decoration-2 underline-offset-4 hidden sm:block"
            >
              View All Products
            </Link>
          </div>

          <ProductList limit={3} />

          <div className="mt-12 text-center sm:hidden">
            <Link to="/shop" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

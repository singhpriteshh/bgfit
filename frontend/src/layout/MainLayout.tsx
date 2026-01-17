import { useLocation } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className={`grow w-full ${!isHome ? "pt-20" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

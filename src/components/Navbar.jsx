import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const destinations = ["Europe", "Asia", "Americas", "Africa", "Middle East", "Islands"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = !scrolled && isHome;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? "bg-transparent" : "bg-white shadow-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Boomerang Travel"
              className={`h-10 lg:h-12 w-auto object-contain transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {["Home"].map((item) => (
              <Link
                key={item}
                to="/"
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`}
              >
                {item}
              </Link>
            ))}

            {/* Destinations Dropdown */}
            <div className="relative" onMouseEnter={() => setDestOpen(true)} onMouseLeave={() => setDestOpen(false)}>
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`}>
                Destinations <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {destOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {destinations.map((d) => (
                      <Link
                        key={d}
                        to={`/packages?destination=${d}`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        {d}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {["Packages", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919876543210" className={`flex items-center gap-1.5 text-sm font-medium ${isTransparent ? "text-white" : "text-gray-700"}`}>
              <Phone className="w-4 h-4" /> +91 98765 43210
            </a>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-amber-200"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden p-2 ${isTransparent ? "text-white" : "text-gray-700"}`}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {["Home", "Packages", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 font-medium py-2.5 px-2 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center font-bold px-5 py-3 rounded-full"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

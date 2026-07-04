import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const destinationLinks = [
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Antarctica",
  "Europe",
  "Australia/Oceania/Pacific"
];

const navLinks = [
  { label: "Explore Destinations", to: "/packages", dropdown: destinationLinks },
  { label: "Holiday Tour Packages", to: "/packages" },
  { label: "Activities",           to: "/packages?category=Adventure" },
  { label: "MICE",                 to: "/mice" },
  { label: "About",                to: "/about" },
  { label: "Contact",              to: "/contact" },
];

export default function Navbar() {
  const { settings } = useSettings();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openDrop, setOpenDrop]   = useState(null); // label of open dropdown
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = !scrolled && isHome;
  const linkCls = `text-sm font-medium transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? "bg-transparent" : "bg-white shadow-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center rounded-xl transition-all duration-300 ${isTransparent ? "bg-black/30 backdrop-blur-sm px-3 py-1 lg:py-1.5" : ""}`}
          >
            <img
              src="/logo.png"
              alt="Boomerang Travel"
              className={`h-[68px] lg:h-[80px] w-auto object-contain transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) =>
              item.dropdown ? (
                /* Dropdown link */
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDrop(item.label)}
                  onMouseLeave={() => setOpenDrop(null)}
                >
                  <button className={`flex items-center gap-1 ${linkCls}`}>
                    {item.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {openDrop === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        {item.dropdown.map((d) => (
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
              ) : (
                /* Plain link */
                <Link key={item.label} to={item.to} className={linkCls}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${(settings.phone || "").replace(/\s+/g, "")}`}
              className={`flex items-center gap-1.5 text-sm font-medium ${isTransparent ? "text-white" : "text-gray-700"}`}
            >
              <Phone className="w-4 h-4" /> {settings.phone}
            </a>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-amber-200"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 ${isTransparent ? "text-white" : "text-gray-700"}`}
          >
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
              {navLinks.map((item) =>
                item.dropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setOpenDrop(openDrop === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between text-gray-700 font-medium py-2.5 px-2 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDrop === item.label ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openDrop === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pl-4"
                        >
                          {item.dropdown.map((d) => (
                            <Link
                              key={d}
                              to={`/packages?destination=${d}`}
                              onClick={() => { setMenuOpen(false); setOpenDrop(null); }}
                              className="block text-gray-600 text-sm py-2 px-2 rounded-xl hover:text-amber-700 transition-colors"
                            >
                              {d}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-700 font-medium py-2.5 px-2 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
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

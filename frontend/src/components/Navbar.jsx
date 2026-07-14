import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Compass, Sparkles, Ship, Briefcase, Info, MessageSquare } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useCurrency } from "../context/CurrencyContext";

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
  { label: "Holiday Packages",     to: "/packages" },
  { label: "Activities",           to: "/packages?category=Adventure" },
  { label: "Cruises",              to: "/cruises" },
  { label: "MICE",                 to: "/mice" },
  { label: "About",                to: "/about" },
  { label: "Contact",              to: "/contact" },
];

const bottomNavItems = [
  { label: "Packages",   to: "/packages",                   icon: Compass },
  { label: "Activities", to: "/packages?category=Adventure", icon: Sparkles },
  { label: "Cruises",    to: "/cruises",                    icon: Ship },
  { label: "MICE",       to: "/mice",                       icon: Briefcase },
  { label: "About",      to: "/about",                      icon: Info },
  { label: "Contact",    to: "/contact",                    icon: MessageSquare },
];

export default function Navbar() {
  const { settings } = useSettings();
  const { currency, setCurrency } = useCurrency();
  const [scrolled, setScrolled]   = useState(false);
  const [openDrop, setOpenDrop]   = useState(null); // label of open dropdown
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = !scrolled && isHome;
  const linkCls = `text-xs xl:text-sm font-semibold transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`;

  const isActive = (to) => {
    const path = to.split("?")[0];
    return location.pathname === path;
  };

  const headerHeightClass = scrolled
    ? "h-[74px] sm:h-[80px]"
    : "h-[90px] sm:h-[96px]";

  const logoHeightClass = scrolled
    ? "h-[58px] sm:h-[64px]"
    : "h-[74px] sm:h-[80px]";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? "bg-transparent" : "bg-white shadow-md"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`flex items-center justify-between transition-all duration-300 ${headerHeightClass}`}>

            {/* Mobile Left Spacer (to center logo mathematically) */}
            <div className="hidden xl:hidden" />

            {/* Logo - Centered on Mobile, Left-aligned on Desktop */}
            <div className="flex-1 xl:flex-initial flex justify-center xl:justify-start py-2 max-xl:absolute max-xl:left-1/2 max-xl:top-1/2 max-xl:-translate-x-1/2 max-xl:-translate-y-1/2">
              <Link
                to="/"
                className="flex items-center rounded-xl transition-all duration-300"
              >
                <img
                  src="/Boomerang-Logo.png"
                  alt="Boomerang Travel"
                  style={isTransparent ? { filter: "drop-shadow(0px 2px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 1px 3px rgba(255, 255, 255, 0.9))" } : {}}
                  className={`w-auto object-contain transition-all duration-300 ${logoHeightClass}`}
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-4 xl:gap-5">
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
            <div className="hidden xl:flex items-center gap-3 xl:gap-4">
              {/* Desktop Currency Toggle (Click anywhere to swap) */}
              <div 
                onClick={() => setCurrency(currency === "USD" ? "AUD" : "USD")}
                className={`relative flex p-0.5 rounded-full border transition-all cursor-pointer select-none ${isTransparent ? "bg-white/10 border-white/20" : "bg-gray-100 border-gray-200"}`}
              >
                <span
                  className={`relative px-3.5 py-1.5 text-[11px] xl:text-xs font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "USD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "USD" && (
                    <motion.span
                      layoutId="activeCurrencyDesktop"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  USD ($)
                </span>
                <span
                  className={`relative px-3.5 py-1.5 text-[11px] xl:text-xs font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "AUD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "AUD" && (
                    <motion.span
                      layoutId="activeCurrencyDesktop"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  AUD (A$)
                </span>
              </div>

              <Link
                to="/contact"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs xl:text-sm font-bold px-4 xl:px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-amber-200"
              >
                Plan Your Trip
              </Link>
            </div>

            {/* Mobile Top-Right: Full Currency Toggle (Click anywhere to swap) */}
            <div className="flex xl:hidden items-center justify-end w-[90px] sm:w-[125px] ml-auto relative z-20">
              <div 
                onClick={() => setCurrency(currency === "USD" ? "AUD" : "USD")}
                className={`relative flex p-0.5 rounded-full border transition-all cursor-pointer select-none w-full ${isTransparent ? "bg-white/10 border-white/25" : "bg-gray-100 border-gray-200"}`}
              >
                <span
                  className={`relative flex-1 flex items-center justify-center py-1 text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "USD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "USD" && (
                    <motion.span
                      layoutId="activeCurrencyMobile"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-sm z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  USD ($)
                </span>
                <span
                  className={`relative flex-1 flex items-center justify-center py-1 text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "AUD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "AUD" && (
                    <motion.span
                      layoutId="activeCurrencyMobile"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-sm z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  AUD (A$)
                </span>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-1 py-2 flex items-center justify-around xl:hidden pb-safe">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-0.5 px-0.5 transition-all cursor-pointer ${
                active ? "text-amber-500 font-semibold" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110 stroke-[2.5]" : "stroke-[2]"}`} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

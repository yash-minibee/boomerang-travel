import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Star, Globe, Settings, ChevronDown,
  Plus, List, X, Compass, MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { imageUrl } from "../../api/api";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    label: "Packages", icon: Package, children: [
      { label: "All Packages", icon: List, path: "/packages" },
      { label: "Add Package", icon: Plus, path: "/packages/add" },
    ]
  },
  {
    label: "Destinations", icon: Compass, children: [
      { label: "All Destinations", icon: List, path: "/destinations" },
      { label: "Add Destination", icon: Plus, path: "/destinations/add" },
    ]
  },
  {
    label: "Inquiries", icon: MessageSquare, children: [
      { label: "Package Inquiries", icon: List, path: "/inquiries" },
      { label: "Custom Requests", icon: List, path: "/inquiries/custom" },
    ]
  },
  { label: "Testimonials", icon: Star, path: "/testimonials" },
  {
    label: "Website Content", icon: Globe, children: [
      { label: "Home Page", icon: Globe, path: "/content/home" },
      { label: "About Page", icon: Globe, path: "/content/about" },
      { label: "Contact Page", icon: Globe, path: "/content/contact" },
    ]
  },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function NavItem({ item, onClose }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => item.children?.some(c => location.pathname.startsWith(c.path)));

  if (item.children) {
    const isActive = item.children.some(c => location.pathname.startsWith(c.path));
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`sidebar-item w-full justify-between ${isActive ? "text-amber-400" : "text-teal-200"}`}
        >
          <span className="flex items-center gap-3">
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 mt-1 space-y-1 border-l border-teal-800 pl-3"
            >
              {item.children.map(child => (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={`sidebar-item text-xs ${location.pathname === child.path ? "active" : "text-teal-300"}`}
                >
                  <child.icon className="w-3.5 h-3.5 shrink-0" />
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isActive = location.pathname === item.path;
  return (
    <Link
      to={item.path}
      onClick={onClose}
      className={`sidebar-item ${isActive ? "active" : "text-teal-200"}`}
    >
      <item.icon className="w-4 h-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const content = (
    <div className="h-full flex flex-col bg-teal-950">
      {/* Logo */}
      <div className="p-5 border-b border-teal-800 flex items-center justify-between">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Boomerang</div>
            <div className="text-teal-400 text-xs">Admin Panel</div>
          </div>
        </Link>
        {mobileOpen !== undefined && (
          <button onClick={onClose} className="lg:hidden text-teal-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {nav.map((item, i) => (
          <NavItem key={i} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-teal-800">
        <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-2 hover:bg-teal-900/40 rounded-xl transition-colors">
          {user?.avatar_url ? (
            <img src={imageUrl(user.avatar_url)} alt="Admin" className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/40" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-amber-400/40">
              {user?.name?.[0] ?? "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.name ?? "Admin"}</div>
            <div className="text-teal-400 text-xs capitalize">{(user?.role ?? "editor").replace('_', ' ')}</div>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0 flex-col">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.25 }} className="absolute left-0 top-0 bottom-0 w-64">
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

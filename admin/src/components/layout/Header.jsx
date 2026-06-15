import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, Mail, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const notifications = [
  { id: 1, text: "New inquiry received", time: "2m ago", unread: true },
  { id: 2, text: "Testimonial pending review", time: "1h ago", unread: true },
  { id: 3, text: "Package updated", time: "3h ago", unread: false },
];

export default function Header({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search anything..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 w-64" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">Notifications</span>
                  <span className="text-xs text-teal-600 font-medium cursor-pointer">Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`px-5 py-4 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 ${n.unread ? "bg-teal-50/40" : ""}`}>
                    {n.unread && <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 shrink-0" />}
                    <div className={n.unread ? "" : "ml-5"}>
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Mail className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="relative ml-1">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-teal-200">
              {user?.name?.[0] ?? "A"}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">{user?.name?.split(" ")[0] ?? "Admin"}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                {[{ icon: User, label: "My Profile" }, { icon: Settings, label: "Settings" }].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Icon className="w-4 h-4 text-gray-400" />{label}
                  </button>
                ))}
                <div className="border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

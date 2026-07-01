import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const SocialIcon = ({ href, children }) => (
  <a href={href} className="w-9 h-9 rounded-full bg-teal-800 hover:bg-amber-500 flex items-center justify-center transition-colors">
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-300" xmlns="http://www.w3.org/2000/svg">{children}</svg>
  </a>
);

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="bg-teal-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <img src="/logo.png" alt="Boomerang Travel" className="h-10 w-auto object-contain brightness-0 invert" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Curating extraordinary travel experiences across the globe. Every journey tells a story — let us write yours.
          </p>
          <div className="flex gap-3 pt-1">
            <SocialIcon href={settings.facebook_url || "#"}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></SocialIcon>
            <SocialIcon href={settings.instagram_url || "#"}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-gray-300"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-gray-300"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" className="stroke-gray-300"/></SocialIcon>
            <SocialIcon href={settings.twitter_url || "#"}><path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" className="stroke-gray-300 fill-none" strokeLinecap="round"/></SocialIcon>
            <SocialIcon href={settings.youtube_url || "#"}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="gray"/></SocialIcon>
          </div>
        </div>

        {/* Destinations */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base border-b border-teal-800 pb-2">Popular Destinations</h4>
          <ul className="space-y-2 text-sm">
            {["Santorini, Greece", "Bali, Indonesia", "Kyoto, Japan", "Maldives", "Amalfi Coast", "Morocco"].map((d) => (
              <li key={d}>
                <Link to="/packages" className="hover:text-amber-400 transition-colors">→ {d}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base border-b border-teal-800 pb-2">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[["Home", "/"], ["Packages", "/packages"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, path]) => (
              <li key={label}>
                <Link to={path} className="hover:text-amber-400 transition-colors">→ {label}</Link>
              </li>
            ))}
            <li><a href="#" className="hover:text-amber-400 transition-colors">→ Privacy Policy</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">→ Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base border-b border-teal-800 pb-2">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${(settings.phone || "").replace(/\s+/g, "")}`} className="hover:text-amber-400 transition-colors">{settings.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© 2025 Boomerang Global Travel. All rights reserved.</p>
          <p>Crafted with ❤️ for explorers worldwide</p>
        </div>
      </div>
    </footer>
  );
}

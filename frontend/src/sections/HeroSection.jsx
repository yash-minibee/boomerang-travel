import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const floatingCards = [
  { icon: "🌏", label: "50+ Destinations", sub: "Across 6 continents" },
  { icon: "⭐", label: "4.9 Rating", sub: "10,000+ happy travellers" },
  { icon: "🏅", label: "Award Winning", sub: "Best Travel Agency 2024" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
          alt="Travel background"
          className="w-full h-full object-cover"
        />
        {/* Teal-tinted overlay matching logo's deep teal */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-teal-900/60 to-teal-800/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">

          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full"
          >
            ✈️ Crafting Extraordinary Journeys Since 2010
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
            The World Awaits
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Your Next Adventure
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Luxury curated travel packages to the world's most breathtaking destinations.
            Handcrafted itineraries, seamless experiences, unforgettable memories.
          </p>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-4xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Destination</div>
                    <select className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                      <option>Where to?</option>
                      <option>Europe</option>
                      <option>Asia</option>
                      <option>Americas</option>
                      <option>Maldives</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                  <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Travel Date</div>
                    <input type="date" className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                  <Users className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Travellers</div>
                    <select className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                      <option>2 Adults</option>
                      <option>1 Adult</option>
                      <option>3 Adults</option>
                      <option>Family (4)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Link
                  to="/packages"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg"
                >
                  <Search className="w-5 h-5" /> Search Packages
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all"
                >
                  Custom Trip
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Cards */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {floatingCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass rounded-2xl px-5 py-3 flex items-center gap-3"
            >
              <span className="text-2xl">{card.icon}</span>
              <div className="text-left">
                <div className="text-white font-bold text-sm">{card.label}</div>
                <div className="text-white/70 text-xs">{card.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-12 flex justify-center">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </div>
    </section>
  );
}

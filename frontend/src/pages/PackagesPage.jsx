import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import PackageCard from "../components/PackageCard";
import { api } from "../api/api";

const travelStyles = ["All", "Cultural", "Luxury", "Adventure", "Wellness", "Honeymoon", "Trekking"];
const durationOptions = ["Any", "1-5 Days", "6-10 Days", "11-15 Days", "15+ Days"];

function mapPkg(pkg) {
  return {
    ...pkg,
    startingPrice: Number(pkg.starting_price),
    reviews: pkg.review_count,
    tag: pkg.tags?.[0] ?? null,
    destinations: [pkg.destination_region ?? ""],
    days: parseInt(pkg.duration) || 0,
    style: [pkg.category],
    image: pkg.cover_image ?? `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80`,
  };
}

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("All");
  const [style, setStyle] = useState("All");
  const [duration, setDuration] = useState("Any");
  const [budget, setBudget] = useState(5000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: "active", limit: 50 };
      if (search) params.search = search;
      if (destination !== "All") params.destination = destination;
      if (style !== "All") params.category = style;
      const res = await api.getPackages(params);
      let data = (res.data ?? []).map(mapPkg);

      if (duration !== "Any") {
        data = data.filter(p => {
          if (duration === "1-5 Days") return p.days <= 5;
          if (duration === "6-10 Days") return p.days >= 6 && p.days <= 10;
          if (duration === "11-15 Days") return p.days >= 11 && p.days <= 15;
          if (duration === "15+ Days") return p.days > 15;
          return true;
        });
      }
      data = data.filter(p => p.startingPrice <= budget);
      setPackages(data);
      setTotal(data.length);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, destination, style, duration, budget]);

  useEffect(() => { load(); }, [load]);

  const SidebarContent = () => (
    <div className="space-y-7">
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Search</h3>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300" />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Destination</h3>
        <div className="space-y-2">
          {["All", "Europe", "Asia", "Americas", "Africa", "Islands"].map(d => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="destination" value={d} checked={destination === d} onChange={() => setDestination(d)} className="accent-teal-600" />
              <span className={`text-sm ${destination === d ? "text-teal-700 font-semibold" : "text-gray-600"}`}>{d}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Budget: <span className="text-amber-600 font-bold">${budget.toLocaleString()}</span></h3>
        <input type="range" min={500} max={5000} step={100} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-amber-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$500</span><span>$5,000+</span></div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Duration</h3>
        <div className="space-y-2">
          {durationOptions.map(d => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="duration" value={d} checked={duration === d} onChange={() => setDuration(d)} className="accent-teal-600" />
              <span className={`text-sm ${duration === d ? "text-teal-700 font-semibold" : "text-gray-600"}`}>{d}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Travel Style</h3>
        <div className="flex flex-wrap gap-2">
          {travelStyles.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${style === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => { setSearch(""); setDestination("All"); setStyle("All"); setDuration("Any"); setBudget(5000); }}
        className="w-full text-sm text-red-500 border border-red-200 hover:bg-red-50 py-2.5 rounded-xl transition-colors">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore All Packages
          </motion.h1>
          <p className="text-teal-200 mt-3 max-w-xl mx-auto">Find your perfect journey from our handcrafted collection of luxury travel experiences.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-extrabold text-gray-900 text-base mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Filters
              </h2>
              <SidebarContent />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex lg:hidden items-center justify-between mb-5">
              <p className="text-gray-500 text-sm">{total} packages found</p>
              <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
            <p className="hidden lg:block text-gray-500 text-sm mb-6">
              Showing <span className="font-bold text-gray-800">{total}</span> packages
            </p>

            {loading ? (
              <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : packages.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-700">No packages found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
              </div>
            )}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} className="relative w-80 max-w-full h-full bg-white shadow-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Filters
              </h2>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </div>
  );
}

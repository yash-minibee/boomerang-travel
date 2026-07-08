import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import CruiseCard from "../components/CruiseCard";
import { api, imageUrl } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

const cruiseStyles = ["All", "Luxury", "Premium", "River Cruise", "Family", "Adventure"];
const durationOptions = ["Any", "1-5 Days", "6-10 Days", "11-15 Days", "15+ Days"];

function mapCruise(c) {
  return {
    ...c,
    startingPrice: Number(c.starting_price),
    reviews: c.review_count,
    tag: c.tags?.[0] ?? null,
    destinations: [c.destination_name || c.destination_region || ""],
    days: parseInt(c.duration) || 0,
    style: [c.category],
    image: imageUrl(c.cover_image) || `https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=800&q=80`,
  };
}

export default function CruisesPage() {
  const { currency, convertUSD } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const destParam = searchParams.get("destination") || "All";

  const [cruises, setCruises] = useState([]);
  const [destList, setDestList] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState(destParam);
  const [style, setStyle] = useState("All");
  const [duration, setDuration] = useState("Any");
  const [budget, setBudget] = useState(15000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Load destinations dynamically
  useEffect(() => {
    api.getCruiseDestinations({ limit: 100 })
      .then(res => setDestList(res.data ?? []))
      .catch(e => console.error(e));
  }, []);

  // Reset page when any filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, destination, style, duration, budget]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Sync state with URL search params changes
  useEffect(() => {
    const dest = searchParams.get("destination") || "All";
    setDestination(dest);
  }, [searchParams]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: "active", limit: 50 };
      if (search) params.search = search;
      if (destination !== "All") params.destination = destination;
      if (style !== "All") params.category = style;
      const res = await api.getCruises(params);
      let data = (res.data ?? []).map(mapCruise);

      if (duration !== "Any") {
        data = data.filter(c => {
          if (duration === "1-5 Days") return c.days <= 5;
          if (duration === "6-10 Days") return c.days >= 6 && c.days <= 10;
          if (duration === "11-15 Days") return c.days >= 11 && c.days <= 15;
          if (duration === "15+ Days") return c.days > 15;
          return true;
        });
      }
      data = data.filter(c => {
        const localPrice = currency === 'AUD' ? (c.price_aud ?? convertUSD(c.startingPrice)) : c.startingPrice;
        return localPrice <= budget;
      });
      setCruises(data);
      setTotal(data.length);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, destination, style, duration, budget, currency, convertUSD]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(cruises.length / ITEMS_PER_PAGE);
  const paginatedCruises = cruises.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startIndex = cruises.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, cruises.length);

  const renderSidebarContent = () => (
    <div className="space-y-7">
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Search</h3>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cruises..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white" />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Destination</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="radio" name="destination" value="All" checked={destination === "All"} onChange={() => {
              setDestination("All");
              searchParams.delete("destination");
              setSearchParams(searchParams);
            }} className="accent-teal-600" />
            <span className={`text-sm ${destination === "All" ? "text-teal-700 font-semibold" : "text-gray-600"}`}>All Destinations</span>
          </label>
          {destList.map(d => (
            <label key={d.id} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="destination" value={d.name} checked={destination === d.name} onChange={() => {
                setDestination(d.name);
                searchParams.set("destination", d.name);
                setSearchParams(searchParams);
              }} className="accent-teal-600" />
              <span className={`text-sm ${destination === d.name ? "text-teal-700 font-semibold" : "text-gray-600"}`}>{d.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Budget: <span className="text-amber-600 font-bold">{currency === 'AUD' ? 'A$' : '$'}{budget.toLocaleString()}</span></h3>
        <input type="range" min={1000} max={15000} step={500} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-amber-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{currency === 'AUD' ? 'A$1,000' : '$1,000'}</span>
          <span>{currency === 'AUD' ? 'A$15,000+' : '$15,000+'}</span>
        </div>
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
        <h3 className="font-bold text-gray-800 text-sm mb-3">Cruise Style</h3>
        <div className="flex flex-wrap gap-2">
          {cruiseStyles.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${style === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => {
        setSearch("");
        setDestination("All");
        setStyle("All");
        setDuration("Any");
        setBudget(15000);
        searchParams.delete("destination");
        setSearchParams(searchParams);
      }}
        className="w-full text-sm text-red-500 border border-red-200 hover:bg-red-50 py-2.5 rounded-xl transition-colors cursor-pointer">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20 lg:pt-24">
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore All Cruises
          </motion.h1>
          <p className="text-teal-200 mt-3 max-w-xl mx-auto">Sail the open seas with our collection of ultra-luxury boutique cruises and itineraries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="font-extrabold text-gray-900 text-base mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Filters
              </h2>
              {renderSidebarContent()}
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex lg:hidden items-center justify-between mb-5">
              <p className="text-gray-500 text-sm">{startIndex}–{endIndex} of {cruises.length} cruises</p>
              <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm cursor-pointer">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
            <p className="hidden lg:block text-gray-500 text-sm mb-6">
              Showing <span className="font-bold text-gray-800">{startIndex}–{endIndex}</span> of <span className="font-bold text-gray-800">{cruises.length}</span> cruises
            </p>

            {loading ? (
              <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : cruises.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚓</div>
                <h3 className="text-xl font-bold text-gray-700">No cruises found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCruises.map(cruise => <CruiseCard key={cruise.id} cruise={cruise} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pb-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                            currentPage === pageNum
                              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                              : "border border-gray-200 bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
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
            {renderSidebarContent()}
          </motion.div>
        </div>
      )}
    </div>
  );
}

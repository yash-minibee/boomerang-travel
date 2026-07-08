import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import PackageCard from "../components/PackageCard";
import CruiseCard from "../components/CruiseCard";
import { api, imageUrl } from "../api/api";
import usePageContent from "../hooks/usePageContent";

function mapPkg(pkg) {
  return {
    ...pkg,
    startingPrice: Number(pkg.starting_price),
    reviews: pkg.review_count,
    tag: pkg.tags?.[0] ?? null,
    destinations: [pkg.destination_region ?? ""],
    days: parseInt(pkg.duration) || 0,
    style: [pkg.category],
    image: imageUrl(pkg.cover_image) || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80`,
  };
}

export default function ContinentPackages() {
  const [sections, setSections] = useState([]);
  const [packagesBySection, setPackagesBySection] = useState({});
  const [loading, setLoading] = useState(true);

  const scrollRefs = useRef({});

  const defaultContent = {
    home_continent_sections: JSON.stringify([
      {
        id: "sec-europe",
        continent: "Europe",
        title: "European Escapes",
        subtitle: "Indulge in iconic landmarks, clifftop vistas, and luxury cultural excursions across Europe.",
        badge: "Romance & History"
      },
      {
        id: "sec-asia",
        continent: "Asia",
        title: "Asian Adventures",
        subtitle: "Immerse yourself in lush gardens, ancient temples, tropical retreats, and vibrant local cuisines.",
        badge: "Cultures & Paradises"
      }
    ])
  };

  const { content, loading: contentLoading } = usePageContent("home", defaultContent);

  useEffect(() => {
    if (contentLoading) return;

    let parsedSections = [];
    try {
      parsedSections = content.home_continent_sections ? JSON.parse(content.home_continent_sections) : [];
    } catch (e) {
      console.error("Failed to parse home_continent_sections:", e);
    }

    setSections(parsedSections);

    if (parsedSections.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const promises = parsedSections.map(sec => {
          const selectedIds = sec.items ?? [];
          if (selectedIds.length > 0) {
            if (sec.type === "cruise") {
              return api.getCruises({ limit: 100 });
            } else {
              return api.getPackages({ limit: 100 });
            }
          } else {
            return api.getPackages({ destination: sec.continent, status: "active", limit: 12 });
          }
        });
        const results = await Promise.all(promises);
        
        const newPackages = {};
        parsedSections.forEach((sec, idx) => {
          const allItems = results[idx].data ?? [];
          const selectedIds = sec.items ?? [];
          
          if (selectedIds.length > 0) {
            const filtered = selectedIds
              .map(id => allItems.find(item => Number(item.id) === Number(id)))
              .filter(Boolean);
            if (sec.type === "cruise") {
              newPackages[sec.id || idx] = filtered.map(c => ({
                ...c,
                isCruise: true,
                startingPrice: Number(c.starting_price),
                reviews: c.review_count,
                tag: c.tags?.[0] ?? null,
                destinations: [],
                days: parseInt(c.duration) || 0,
                style: [c.category],
                image: c.cover_image,
              }));
            } else {
              newPackages[sec.id || idx] = filtered.map(mapPkg);
            }
          } else {
            newPackages[sec.id || idx] = allItems.map(mapPkg);
          }
        });
        setPackagesBySection(newPackages);
      } catch (err) {
        console.error("Error fetching packages for sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [content.home_continent_sections, contentLoading]);

  const handleScroll = (secId, direction) => {
    const ref = scrollRefs.current[secId];
    if (ref) {
      const cardWidth = 364; // width (340) + gap (24)
      ref.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  const setRef = (id, el) => {
    if (el) {
      scrollRefs.current[id] = el;
    }
  };

  if (loading || contentLoading) {
    return (
      <div className="py-20 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-10 bg-white overflow-hidden relative">
      {/* Hide Scrollbars CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {sections.map((sec, idx) => {
          const pkgs = packagesBySection[sec.id || idx] ?? [];

          return (
            <div key={sec.id || idx} className="relative">
              {/* Explore More link (floats top right on desktop, centers below header on mobile) */}
              <div className="md:absolute md:top-16 md:right-0 flex justify-center mb-4 md:mb-0 z-20">
                <Link 
                  to={sec.type === "cruise" ? "/cruises" : "/packages"} 
                  className="flex items-center gap-1.5 text-teal-600 font-bold text-sm hover:gap-2.5 transition-all"
                >
                  Explore More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                className="text-center mb-8 max-w-2xl mx-auto"
              >
                {sec.badge && (
                  <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
                    {sec.badge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                  {sec.title}
                </h2>
                {sec.subtitle && (
                  <p className="text-gray-500 mt-2">
                    {sec.subtitle}
                  </p>
                )}
              </motion.div>

              <div className="relative group">
                {pkgs.length > 1 && (
                  <>
                    <button 
                      onClick={() => handleScroll(sec.id || idx, "left")}
                      className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 flex items-center justify-center transition-all cursor-pointer hidden md:flex"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleScroll(sec.id || idx, "right")}
                      className="absolute right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 flex items-center justify-center transition-all cursor-pointer hidden md:flex"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Horizontal Scroll Wrapper or Placeholder */}
                {pkgs.length === 0 ? (
                  <div className="flex justify-center">
                    <div className="w-[300px] sm:w-[340px] bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[220px] text-center">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mx-auto">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m-4-3h9m-9 3h9m-9 3h9m-9 3h9M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Custom {sec.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          We are currently curating luxury packages for {sec.title}. Our travel experts can design a personalized journey tailored to your preferences.
                        </p>
                      </div>
                      <Link 
                        to="/contact" 
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm py-3 rounded-2xl transition-all mt-4"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={(el) => setRef(sec.id || idx, el)}
                    className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
                  >
                    {pkgs.map((item) => (
                      <div key={item.id} className="w-[300px] sm:w-[340px] shrink-0 snap-start flex flex-col">
                        {item.isCruise ? (
                          <CruiseCard cruise={item} showTag={false} showHighlights={false} />
                        ) : (
                          <PackageCard pkg={item} showTag={false} showHighlights={false} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
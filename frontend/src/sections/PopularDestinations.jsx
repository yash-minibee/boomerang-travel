import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { api, imageUrl } from "../api/api";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.getDestinations({ featured: 1, limit: 6 })
      .then(res => setDestinations(res.data ?? []))
      .catch(console.error);
  }, []);

  if (destinations.length === 0) return null;

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Explore the World</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Popular Destinations</h2>
          </motion.div>
          <Link to="/packages" className="flex items-center gap-1.5 text-teal-600 font-semibold text-sm hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(dest => (
            <motion.div key={dest.id} variants={cardVariants}>
              <Link to={`/packages?destination=${dest.region}`}>
                <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-64">
                  {dest.hero_image ? (
                    <img src={imageUrl(dest.hero_image)} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/20 to-transparent" />
                  <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                    {dest.region}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1"><MapPin className="w-3.5 h-3.5" /> {dest.country}</div>
                    <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                    <p className="text-white/70 text-sm mt-1 line-clamp-1">{dest.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-white text-sm">{dest.package_count ?? 0} packages</span>
                      <span className="flex items-center gap-1 text-white/80 text-xs group-hover:text-amber-300 transition-colors">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

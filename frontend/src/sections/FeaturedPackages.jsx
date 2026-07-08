import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, ArrowRight, MapPin } from "lucide-react";
import { api, imageUrl } from "../api/api";
import usePageContent from "../hooks/usePageContent";
import { useCurrency } from "../context/CurrencyContext";


export default function FeaturedPackages() {
  const [packages, setPackages] = useState([]);

  const defaultContent = {
    packages_title: "Featured Packages",
    packages_subtitle: "Our most loved luxury travel packages, curated for the discerning explorer."
  };

  const { content } = usePageContent("home", defaultContent);

  useEffect(() => {
    api.getPackages({ featured: 1, status: "active", limit: 3 })
      .then(res => setPackages(res.data ?? []))
      .catch(console.error);
  }, []);

  const { formatPrice } = useCurrency();

  if (packages.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Handpicked For You</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{content.packages_title}</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{content.packages_subtitle}</p>
        </motion.div>

        <div className="space-y-8">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
              className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col lg:flex-row border border-gray-100">
              <div className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden bg-teal-50">
                {imageUrl(pkg.cover_image) ? (
                  <img src={imageUrl(pkg.cover_image)} alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-4xl font-bold opacity-20">
                    {pkg.title?.[0]}
                  </div>
                )}
                {pkg.tags?.[0] && (
                  <span className="absolute top-5 left-5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">{pkg.tags[0]}</span>
                )}
              </div>
              <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-teal-600 text-sm font-medium">
                    <MapPin className="w-4 h-4" /><span>{pkg.destination_region}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl lg:text-2xl font-extrabold text-gray-900">{pkg.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-800">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm"><Clock className="w-4 h-4" /><span>{pkg.duration}</span></div>
                  <div className="flex flex-wrap gap-2">
                    {(pkg.highlights ?? []).slice(0, 4).map(h => (
                      <span key={h} className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full font-medium">✓ {h}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400">Starting from</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {formatPrice(pkg.starting_price ?? 0, pkg.price_aud)}<span className="text-sm font-normal text-gray-400"> / person</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to="/contact" className="border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors">Inquire</Link>
                    <Link to={`/packages/${pkg.slug}`} className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/packages" className="inline-flex items-center gap-2 border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white font-bold px-8 py-3.5 rounded-full transition-all">
            View All Packages <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

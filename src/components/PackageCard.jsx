import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, Heart, ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

export default function PackageCard({ pkg }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {pkg.tag && (
          <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {pkg.tag}
          </span>
        )}

        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm">
          <Clock className="w-4 h-4" />
          <span>{pkg.duration}</span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-teal-600 text-xs font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{pkg.destinations.join(" → ")}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight">{pkg.title}</h3>

        <div className="flex flex-wrap gap-1.5">
          {pkg.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">{h}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm text-gray-800">{pkg.rating}</span>
            <span className="text-gray-400 text-xs">({pkg.reviews})</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Starting from</div>
            <div className="font-bold text-lg text-gray-900">${pkg.startingPrice.toLocaleString()}</div>
          </div>
        </div>

        <Link
          to={`/packages/${pkg.slug}`}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm py-3 rounded-2xl transition-all"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

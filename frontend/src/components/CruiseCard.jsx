import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, Heart, ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { imageUrl } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

export default function CruiseCard({ cruise, showTag = true, showHighlights = true }) {
  const [wishlisted, setWishlisted] = useState(false);
  const imgSrc = imageUrl(cruise.image || cruise.cover_image);

  const { formatPrice } = useCurrency();

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col flex-1 h-full w-full">
      <div className="relative overflow-hidden h-56 bg-teal-100 shrink-0">
        {imgSrc ? (
          <img src={imgSrc} alt={cruise.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-4xl font-bold opacity-30">
            {cruise.title?.[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {showTag && cruise.tag && (
          <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {cruise.tag}
          </span>
        )}

        <button onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm">
          <Clock className="w-4 h-4" /><span>{cruise.duration}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-1.5 text-teal-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{(cruise.destinations ?? [cruise.destination_region ?? ""]).join(" → ")}</span>
          </div>

          <h3 className="font-bold text-gray-900 text-lg leading-tight">{cruise.title}</h3>

          {showHighlights && (cruise.highlights ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(cruise.highlights ?? []).slice(0, 3).map(h => (
                <span key={h} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">{h}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm text-gray-800">{cruise.rating}</span>
            <span className="text-gray-400 text-xs">({cruise.reviews ?? cruise.review_count ?? 0})</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Starting from</div>
            <div className="font-bold text-lg text-gray-900">
              {formatPrice(cruise.startingPrice ?? cruise.starting_price ?? 0, cruise.price_aud)}
            </div>
          </div>
        </div>

        <Link to={`/cruises/${cruise.slug}`}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm py-3 rounded-2xl transition-all">
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

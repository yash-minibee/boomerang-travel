import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "../data/travelData";

export default function Testimonials() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-teal-600 font-semibold text-sm tracking-widest uppercase">Traveller Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">What Our Travellers Say</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Real stories from real explorers who trusted Boomerang with their most precious journeys.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-7 border border-amber-100 hover:shadow-lg hover:shadow-amber-100 transition-all relative"
            >
              <div className="absolute top-5 right-5 opacity-10">
                <Quote className="w-12 h-12 text-teal-600" />
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.review}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-amber-100">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}</div>
                  <div className="text-teal-600 text-xs font-medium mt-0.5">{t.package}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

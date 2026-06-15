import { motion } from "framer-motion";
import { Headphones, Map, Users, BadgeDollarSign, Shield, Zap } from "lucide-react";

const features = [
  { icon: Headphones, title: "24/7 Expert Support", desc: "A dedicated trip manager available round the clock, ensuring your journey is always smooth.", color: "from-teal-500 to-teal-700" },
  { icon: Map, title: "Curated Itineraries", desc: "Every package is thoughtfully designed by travel experts with insider knowledge of each destination.", color: "from-amber-400 to-amber-600" },
  { icon: Users, title: "Trusted Local Experts", desc: "Our vetted local guides bring each destination to life with authentic, immersive experiences.", color: "from-teal-400 to-teal-600" },
  { icon: BadgeDollarSign, title: "Best Price Promise", desc: "We guarantee competitive pricing with transparent costs — no hidden fees, ever.", color: "from-amber-500 to-amber-700" },
  { icon: Shield, title: "Safe & Secure Travel", desc: "Fully licensed and insured operations. Your safety and comfort are our top priorities.", color: "from-teal-600 to-teal-800" },
  { icon: Zap, title: "Seamless Planning", desc: "From flights to hotels to experiences — we handle every detail so you can just enjoy.", color: "from-amber-400 to-amber-500" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-teal-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">Why Boomerang</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">The Boomerang Difference</h2>
          <p className="text-teal-300 mt-3 max-w-xl mx-auto">We go beyond booking — crafting once-in-a-lifetime travel experiences that bring you back for more.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[["10K+", "Happy Travellers"], ["50+", "Destinations"], ["200+", "Curated Packages"], ["15+", "Years of Excellence"]].map(([num, label]) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <div className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">{num}</div>
              <div className="text-teal-300 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-teal-900/50 border border-teal-800 hover:border-teal-700 rounded-3xl p-6 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-teal-300 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Heart, Target, Compass, Globe } from "lucide-react";

const team = [
  { name: "Aryan Kapoor", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", bio: "20+ years crafting bespoke travel experiences across 6 continents." },
  { name: "Meera Nair", role: "Head of Experiences", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80", bio: "Luxury hospitality expert with a passion for cultural immersion." },
  { name: "Rahul Dev", role: "Lead Destination Expert", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80", bio: "Visited 70+ countries, bringing unmatched local knowledge to every itinerary." },
  { name: "Sofia Chen", role: "Client Relations Manager", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", bio: "Ensuring every client feels cared for from inquiry to homecoming." },
];

const values = [
  { icon: Heart, title: "Passion-Driven", desc: "We love travel — and it shows in every carefully crafted itinerary we create.", color: "from-amber-400 to-amber-600" },
  { icon: Target, title: "Detail-Obsessed", desc: "From visa documentation to hotel room views — we sweat the small stuff so you don't have to.", color: "from-teal-500 to-teal-700" },
  { icon: Compass, title: "Exploration First", desc: "We believe travel should be transformative, not just a checklist of tourist spots.", color: "from-amber-500 to-amber-700" },
  { icon: Globe, title: "Globally Connected", desc: "Our network of local partners ensures authentic, insider experiences in every destination.", color: "from-teal-600 to-teal-800" },
];

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80" alt="About hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/75 to-teal-800/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">Our Story</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2">About Boomerang Travel</h1>
            <p className="text-teal-100 mt-3 max-w-xl text-sm sm:text-base">Born from a love of exploration. Built on a promise of excellence.</p>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Who We Are</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-5">We're Not Just a Travel Agency. We're Storytellers.</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Boomerang Global Travel was founded in 2010 with one simple belief: travel should feel like the best chapter of your life, not a logistical headache.</p>
              <p>From intimate luxury honeymoons in the Maldives to epic group adventures across Patagonia — we design journeys that reflect who you are and where your soul wants to go.</p>
              <p>With over 15 years of experience, 10,000+ happy travellers, and a network spanning 50+ destinations, we've become India's most trusted premium travel curator.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[["15+", "Years"], ["50+", "Destinations"], ["10K+", "Travellers"]].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-teal-700">{num}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80" alt="Travel team" className="rounded-3xl w-full h-80 object-cover shadow-xl" />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-amber-100">
              <Award className="w-8 h-8 text-amber-500" />
              <div>
                <div className="font-bold text-gray-900 text-sm">Award Winning</div>
                <div className="text-gray-400 text-xs">Best Travel Agency 2024</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-teal-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">What Drives Us</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className="bg-teal-900/50 border border-teal-800 rounded-3xl p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-teal-300 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">The Dreamers</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Meet Our Team</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="text-center group">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-white shadow-lg group-hover:ring-amber-200 transition-all" />
              <h3 className="font-bold text-gray-900 mt-4">{member.name}</h3>
              <p className="text-teal-600 text-sm font-medium mt-0.5">{member.role}</p>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

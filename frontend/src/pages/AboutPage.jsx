import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award, Heart, Target, Compass, Globe, Users, Shield,
  Headphones, Star, ArrowRight, CheckCircle, MapPin,
} from "lucide-react";
import usePageContent from "../hooks/usePageContent";

// ── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { num: "15+",  label: "Years of Excellence" },
  { num: "50+",  label: "Destinations" },
  { num: "10K+", label: "Happy Travellers" },
  { num: "200+", label: "Curated Packages" },
];

const values = [
  {
    icon: Heart,
    title: "Passion-Driven",
    desc: "We love travel — and it shows in every carefully crafted itinerary we create.",
    color: "from-amber-400 to-amber-600",
  },
  {
    icon: Target,
    title: "Detail-Obsessed",
    desc: "From visa docs to hotel room views — we sweat the small stuff so you don't have to.",
    color: "from-teal-500 to-teal-700",
  },
  {
    icon: Compass,
    title: "Exploration First",
    desc: "We believe travel should be transformative, not just a checklist of tourist spots.",
    color: "from-amber-500 to-amber-700",
  },
  {
    icon: Globe,
    title: "Globally Connected",
    desc: "Our network of local partners ensures authentic, insider experiences in every destination.",
    color: "from-teal-600 to-teal-800",
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    desc: "Fully licensed operations, travel insurance support, and a team you can count on 24/7.",
    color: "from-amber-400 to-amber-500",
  },
  {
    icon: Users,
    title: "People First",
    desc: "Every traveller is unique. We listen, personalise, and deliver journeys that fit your story.",
    color: "from-teal-400 to-teal-600",
  },
];

const services = [
  { title: "Holiday Tour Packages",   desc: "Handcrafted domestic and international holiday packages for families, couples, and solo travellers.", icon: "🌴" },
  { title: "Explore Destinations",    desc: "Guided discovery tours across Europe, Asia, Americas, Africa, Middle East, and the Islands.", icon: "🗺️" },
  { title: "Activities & Adventures", desc: "Trekking, diving, safaris, cultural immersions — experiences that go beyond the ordinary.", icon: "🏔️" },
  { title: "MICE",                    desc: "End-to-end Meetings, Incentives, Conferences & Events planning across global destinations.", icon: "🤝" },
  { title: "Honeymoon Specials",      desc: "Romantic, intimate escapes curated to perfection for newlyweds and couples.", icon: "💍" },
  { title: "Luxury Travel",           desc: "Bespoke ultra-luxury experiences with private villas, chartered yachts, and exclusive access.", icon: "✨" },
];

const team = [
  {
    name: "Aryan Kapoor",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "20+ years crafting bespoke travel experiences across 6 continents.",
  },
  {
    name: "Meera Nair",
    role: "Head of Experiences",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    bio: "Luxury hospitality expert with a passion for cultural immersion.",
  },
  {
    name: "Rahul Dev",
    role: "Lead Destination Expert",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    bio: "Visited 70+ countries, bringing unmatched local knowledge to every itinerary.",
  },
  {
    name: "Sofia Chen",
    role: "Client Relations Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    bio: "Ensuring every client feels cared for from inquiry to homecoming.",
  },
];


// ── Component ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const defaultContent = {
    about_title: "About Boomerang Travel",
    about_tagline: "Born from a love of exploration. Built on a promise of excellence.\nWe don't just plan trips — we craft journeys that bring you back for more.",
    about_story: "Boomerang Travel was founded with one simple belief: travel should feel like the best chapter of your life, not a logistical headache.\n\nFrom intimate luxury honeymoons in the Maldives to epic group adventures across Patagonia — we design journeys that reflect who you are and where your soul wants to go.\n\nWith over 15 years of experience, 10,000+ happy travellers, and a network spanning 50+ destinations, we've become a trusted name in premium travel curation.",
    years_experience: "15+",
    destinations_count: "50+",
    travelers_count: "10K+"
  };

  const { content } = usePageContent("about", defaultContent);

  const statsList = [
    { num: content.years_experience,  label: "Years of Excellence" },
    { num: content.destinations_count,  label: "Destinations" },
    { num: content.travelers_count, label: "Happy Travellers" },
    { num: "200+", label: "Curated Packages" },
  ];

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center min-h-[400px] sm:h-[70vh] sm:min-h-[480px] py-16 sm:py-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
          alt="About Boomerang Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-teal-900/60 to-teal-800/40" />
        <div className="relative z-10 flex flex-col items-center justify-center text-white px-4 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-3 leading-tight">
              {content.about_title}
            </h1>
            <p className="text-teal-100 mt-4 max-w-2xl text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {content.about_tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/packages"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3 rounded-full transition-all shadow-lg">
                Explore Packages <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact"
                className="flex items-center gap-2 border-2 border-white/60 hover:border-white text-white font-semibold px-7 py-3 rounded-full transition-all backdrop-blur-sm">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div className="bg-teal-900">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map(({ num, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                {num}
              </div>
              <div className="text-teal-300 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Our Story ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Who We Are</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight">
              We're Not Just a Travel Agency.<br />We're Storytellers.
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {content.about_story.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Personalised itineraries for every traveller",
                "Transparent pricing with no hidden fees",
                "24/7 on-trip support from dedicated experts",
                "Partnerships with 200+ hotels and tour operators globally",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <img
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80"
              alt="Travel team planning"
              className="rounded-3xl w-full h-96 object-cover shadow-2xl"
            />

            {/* Rating badge */}
            <div className="absolute -top-5 right-2 sm:-right-5 bg-teal-700 rounded-2xl shadow-xl p-4 text-white text-center z-10">
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="font-extrabold text-lg leading-none">4.9</div>
              <div className="text-teal-200 text-xs mt-0.5">Avg. Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What We Offer ─────────────────────────────────────────────── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Our Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From solo backpacking to large-scale corporate events — we do it all, and we do it well.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────── */}
      <section className="bg-teal-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
                className="bg-teal-900/50 border border-teal-800 hover:border-teal-700 rounded-3xl p-6 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                <p className="text-teal-300 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Team ─────────────────────────────────────────────── */}
      {/* 
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">The Dreamers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Meet Our Team</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Passionate travellers themselves, our team brings lived experience and genuine care to every itinerary.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
              className="text-center group">
              <div className="relative inline-block">
                <img src={member.image} alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-white shadow-lg group-hover:ring-amber-200 transition-all" />
                <div className="absolute inset-0 rounded-full ring-2 ring-teal-600/0 group-hover:ring-teal-600/30 transition-all" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mt-5">{member.name}</h3>
              <p className="text-teal-600 text-sm font-semibold mt-1">{member.role}</p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
      */}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-teal-200 mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Let us turn your travel dreams into reality. Reach out and our experts will craft the perfect
              itinerary just for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/packages"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg">
                Browse Packages <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact"
                className="flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full transition-all">
                <Headphones className="w-4 h-4" /> Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Presentation, Trophy, Globe, ArrowRight,
  CheckCircle2, Mail, Phone, Send, MessageCircle,
  Briefcase, Award, Sparkles, Building, Landmark, ShieldCheck
} from "lucide-react";
import { api } from "../api/api";
import { useSettings } from "../context/SettingsContext";

const offerings = [
  {
    icon: Briefcase,
    title: "Meetings & Executive Board Summits",
    desc: "Flawlessly organized boardroom setups, annual general meetings, and confidential leadership retreats at elite properties worldwide.",
  },
  {
    icon: Award,
    title: "Incentive Travel Programs",
    desc: "Bespoke reward travel programs designed to inspire and motivate your top achievers, featuring luxury accommodations and private excursions.",
  },
  {
    icon: Presentation,
    title: "Conferences & International Summits",
    desc: "Complete event orchestration including luxury venue sourcing, advanced AV setup, hotel room blocks, and group flight coordination.",
  },
  {
    icon: Trophy,
    title: "Exhibitions & Corporate Galas",
    desc: "High-impact product launches, corporate galas, milestone celebrations, and strategic team retreats managed with absolute precision.",
  },
];

const pillars = [
  {
    icon: Landmark,
    title: "Global Venues & Preferred Access",
    desc: "Direct partnerships with international luxury hotel chains, exclusive private retreats, and private aviation providers to secure optimal pricing and VIP arrangements."
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Risk Management",
    desc: "Full alignment with corporate travel compliance, transparent budgeting reporting, robust travel insurance support, and 24/7 on-site crisis assistance."
  },
  {
    icon: Building,
    title: "Dedicated Corporate Account Team",
    desc: "A single, highly experienced account manager coordinating all event details, flight bookings, transfers, menus, and local permits for smooth operation."
  }
];

const features = [
  "Single point of contact for corporate client account management",
  "Negotiated corporate rates at five-star business hotels globally",
  "Custom group check-ins, VIP lounge access, and charter solutions",
  "Unique team-building programs and high-level dinner events",
  "Consolidated invoice accounting with compliance analytics reporting",
  "Dedicated on-ground operations crew present throughout the program",
];

export default function MicePage() {
  const { settings } = useSettings();
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", event_type: "", destination: "", attendees: "50-100", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getDestinations()
      .then(res => {
        if (res && res.data) {
          setDestinations(res.data);
        }
      })
      .catch(err => console.warn("Failed to load destinations for MICE page:", err));
  }, []);

  const handleChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.submitInquiry({
        customer_name:  form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        package_name:   `MICE RFP – ${form.event_type || "Corporate"} (${form.destination || "Flexible"})`,
        travellers:     form.attendees,
        message:        `Company: ${form.company}\n\n${form.message}`,
        type:           "mice",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit proposal request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pt-20 lg:pt-24 font-sans antialiased selection:bg-amber-500 selection:text-white">
      
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-teal-950 py-20 lg:py-28 text-white">
        {/* Decorative Grid and Glow Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/[0.04] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full border border-amber-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Corporate Travel Management
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Strategic MICE Solutions
            </h1>
            <p className="text-amber-400 mt-4 max-w-2xl mx-auto text-lg lg:text-xl font-medium tracking-wide uppercase">
              Meetings · Incentives · Conferences · Events
            </p>
            <p className="text-teal-100 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              We design and execute elite corporate retreats, high-impact conferences, and premium reward travel programs across the globe. Seamless logistics meet extraordinary hospitality.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#rfp" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02] transition-all text-sm">
                Request Proposal (RFP)
              </a>
              <a href={`tel:${(settings.phone || "").replace(/\s+/g, '')}`} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] transition-all text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" /> Speak to Consultant
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Key Corporate Offerings ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-teal-600 text-xs font-bold tracking-widest uppercase">Expertise</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Core Services</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Engineered to deliver exceptional results and seamless event operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-teal-500/30 hover:shadow-lg transition-all duration-300 group flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/10 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-2">{o.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Capabilities / Strategic Pillars ────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 text-xs font-bold tracking-widest uppercase">Infrastructure</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Strategic Pillars</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Optimized for global procurement, traveler safety, and corporate reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-slate-50/50 border border-gray-100 rounded-3xl p-8 hover:border-teal-500/20 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/10 text-teal-600 mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-3">{p.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Corporate Clients Choose Us ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-amber-600 font-bold text-xs tracking-widest uppercase">Difference</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight">
              Corporate Travel Executed Differently
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We eliminate the complexities of managing group travels and corporate events. By combining personalized planning with a powerful network of destination partners, we secure premium experiences while respecting your corporate budget and policies.
            </p>
            <ul className="space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3.5 text-gray-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Corporate Stats */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-6">
            {[
              { icon: Users,        num: "500+",  label: "Corporate Clients" },
              { icon: Globe,        num: "50+",   label: "Event Destinations" },
              { icon: Presentation, num: "1,000+",label: "Projects Completed" },
              { icon: Award,        num: "15+",   label: "Years Experience" },
            ].map(({ icon: Icon, num, label }, i) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:border-amber-500/30 hover:shadow-lg transition-all">
                <Icon className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <div className="text-3xl font-black text-gray-900">{num}</div>
                <div className="text-gray-500 text-xs mt-1.5 uppercase font-semibold tracking-wider">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RFP / Inquiry Form ────────────────────────────────────────── */}
      <section id="rfp" className="border-t border-gray-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-teal-600 font-bold text-xs tracking-widest uppercase">Request for Proposal</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Submit Corporate RFP</h2>
            <p className="text-gray-500 mt-3">
              Share details of your upcoming corporate program, and our specialized consultant will prepare a tailored solution.
            </p>
          </motion.div>

          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 md:p-12">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-2xl font-black text-gray-900">RFP Submitted Successfully</h3>
                <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
                  Thank you for your request. Our corporate MICE specialist is reviewing your requirements and will reach out with a preliminary assessment.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-[1.02]">
                  Submit Another Proposal
                </button>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Contact Full Name *</label>
                    <input required name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Work Email Address *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Contact Phone Number *</label>
                    <input required name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Company Name *</label>
                    <input required name="company" value={form.company} onChange={handleChange} placeholder="Enter organization name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Event Type *</label>
                    <select required name="event_type" value={form.event_type} onChange={handleChange} className={inputClass}>
                      <option value="">Select program type</option>
                      {["Meeting", "Incentive Travel", "Conference / Summit", "Corporate Gala", "Team Retreat", "Product Launch", "Exhibition / Showcase", "Other"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Target Destination *</label>
                    {destinations.length > 0 ? (
                      <select required name="destination" value={form.destination} onChange={handleChange} className={inputClass}>
                        <option value="">Select target destination</option>
                        {destinations.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                        <option value="Custom / Multiple">Custom / Multiple Destinations</option>
                      </select>
                    ) : (
                      <input required name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Singapore, Switzerland, Dubai..." className={inputClass} />
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Expected Number of Attendees *</label>
                    <select required name="attendees" value={form.attendees} onChange={handleChange} className={inputClass}>
                      <option value="">Select size range</option>
                      {["Under 25", "25–50", "50–100", "100–250", "250–500", "500+"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-teal-900 block mb-1.5">Detailed Requirements / Brief</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Specify preferred dates, accommodation standards, AV demands, custom itineraries, and general business goals..."
                      className={`${inputClass} resize-none`} />
                  </div>
                  <div className="sm:col-span-2 space-y-4 pt-2">
                    <button type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-base disabled:opacity-60 hover:scale-[1.01]">
                      <Send className="w-5 h-5" /> {submitting ? "Submitting Request..." : "Request Corporate Proposal"}
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, "")}?text=Hi! We would like to inquire about corporate MICE travel solutions.`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
                        <MessageCircle className="w-4.5 h-4.5" /> WhatsApp Corporate Desk
                      </a>
                      <a href={`mailto:${settings.email}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm">
                        <Mail className="w-4.5 h-4.5" /> Email Procurement Desk
                      </a>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Navigation Actions ────────────────────────────────────────── */}
      <div className="text-center pb-20 pt-10 border-t border-gray-100">
        <Link to="/"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-amber-600 text-sm font-medium transition-colors">
          ← Return to Home
        </Link>
        <span className="text-gray-300 mx-4">·</span>
        <Link to="/contact"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-amber-600 text-sm font-medium transition-colors">
          General Contact <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

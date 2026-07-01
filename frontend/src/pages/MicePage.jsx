import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Presentation, Trophy, Globe, ArrowRight,
  CheckCircle, Mail, Phone, Send, MessageCircle,
} from "lucide-react";
import { api } from "../api/api";
import { useSettings } from "../context/SettingsContext";

const offerings = [
  {
    icon: "🤝",
    title: "Meetings",
    desc: "Seamlessly planned corporate meetings at world-class venues across global destinations.",
  },
  {
    icon: "🏆",
    title: "Incentives",
    desc: "Reward your top performers with unforgettable incentive trips designed to inspire and motivate.",
  },
  {
    icon: "🎤",
    title: "Conferences",
    desc: "End-to-end conference management — venue sourcing, logistics, AV, accommodation and beyond.",
  },
  {
    icon: "🎉",
    title: "Events",
    desc: "Product launches, gala dinners, team-building retreats — executed flawlessly every time.",
  },
];

const features = [
  "Dedicated MICE account manager",
  "Venue sourcing across 50+ destinations",
  "Group travel & accommodation coordination",
  "Customised team-building activities",
  "On-ground support at every event",
  "Transparent budgeting & cost management",
];

export default function MicePage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", event_type: "", attendees: "50-100", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
        package_name:   `MICE – ${form.event_type || "General Enquiry"}`,
        travellers:     form.attendees,
        message:        `Company: ${form.company}\n\n${form.message}`,
        type:           "mice",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <div className="min-h-screen bg-teal-950 pt-20 lg:pt-24">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-amber-500/30 mb-6">
              Coming Soon
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              MICE Services
            </h1>
            <p className="text-teal-200 mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
              Meetings · Incentives · Conferences · Events
            </p>
            <p className="text-teal-300 mt-3 max-w-xl mx-auto text-base">
              We're crafting something exceptional for corporate travellers. Our dedicated MICE division
              launches soon — register your interest now and be first in line.
            </p>

            {/* Countdown-style badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mt-8">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">Launching Q3 2025 — Register Interest Below</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Offerings grid ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offerings.map((o, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
              className="bg-teal-900/60 border border-teal-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all">
              <div className="text-4xl mb-4">{o.icon}</div>
              <h3 className="font-bold text-white text-lg mb-2">{o.title}</h3>
              <p className="text-teal-300 text-sm leading-relaxed">{o.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why choose us for MICE ────────────────────────────────────── */}
      <section className="border-t border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">Why Boomerang for MICE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-6 leading-tight">
                Corporate Events Done Differently
              </h2>
              <p className="text-teal-300 leading-relaxed mb-8">
                From intimate board retreats to large-scale international conferences, we bring the same
                passion and precision to every corporate event that we do to every leisure journey.
              </p>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-teal-200 text-sm">
                    <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-5">
              {[
                { icon: Users,        num: "500+",  label: "Corporate Clients" },
                { icon: Globe,        num: "50+",   label: "Event Destinations" },
                { icon: Presentation, num: "1,000+",label: "Events Executed" },
                { icon: Trophy,       num: "15+",   label: "Years Experience" },
              ].map(({ icon: Icon, num, label }, i) => (
                <motion.div key={i} whileHover={{ y: -4 }}
                  className="bg-teal-900/60 border border-teal-800 rounded-3xl p-6 text-center hover:border-amber-500/40 transition-all">
                  <Icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <div className="text-3xl font-extrabold text-white">{num}</div>
                  <div className="text-teal-400 text-sm mt-1">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Register Interest Form ────────────────────────────────────── */}
      <section className="border-t border-teal-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">Be the First to Know</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Register Your Interest</h2>
            <p className="text-teal-300 mt-3">
              Share your requirements and our corporate travel specialist will reach out to you personally.
            </p>
          </motion.div>

          <div className="bg-teal-900/60 border border-teal-800 rounded-3xl p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-extrabold text-white">You're Registered!</h3>
                <p className="text-teal-300 mt-3 max-w-md mx-auto">
                  Our MICE specialist will contact you shortly to discuss your requirements.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors">
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Full Name *</label>
                    <input required name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Work Email *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Company Name</label>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Your company" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Event Type</label>
                    <select name="event_type" value={form.event_type} onChange={handleChange} className={inputClass}>
                      <option value="" className="bg-teal-900">Select type</option>
                      {["Meeting", "Incentive Trip", "Conference", "Corporate Event", "Team Building", "Product Launch", "Other"].map(o => (
                        <option key={o} value={o} className="bg-teal-900">{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Expected Attendees</label>
                    <select name="attendees" value={form.attendees} onChange={handleChange} className={inputClass}>
                      <option value="" className="bg-teal-900">Select range</option>
                      {["10–25", "25–50", "50–100", "100–250", "250–500", "500+"].map(o => (
                        <option key={o} value={o} className="bg-teal-900">{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-teal-300 block mb-1.5">Tell Us More</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Destination preferences, dates, special requirements..."
                      className={`${inputClass} resize-none`} />
                  </div>
                  <div className="sm:col-span-2 space-y-3">
                    <button type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-base disabled:opacity-60">
                      <Send className="w-5 h-5" /> {submitting ? "Submitting..." : "Register My Interest"}
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, "")}?text=Hi! I'm interested in MICE services.`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl transition-colors text-sm">
                        <MessageCircle className="w-4 h-4" /> WhatsApp Us
                      </a>
                      <a href={`mailto:${settings.email}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 border border-teal-700 text-white font-semibold py-3 rounded-2xl transition-colors text-sm">
                        <Mail className="w-4 h-4" /> Email Directly
                      </a>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Back to site ─────────────────────────────────────────────── */}
      <div className="text-center pb-16">
        <Link to="/"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-amber-400 text-sm font-medium transition-colors">
          ← Back to Home
        </Link>
        <span className="text-teal-700 mx-3">·</span>
        <Link to="/contact"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-amber-400 text-sm font-medium transition-colors">
          General Contact <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

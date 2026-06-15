import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { api } from "../api/api";

const contactInfo = [
  { icon: Phone, label: "Call Us", value: "+91 98765 43210", href: "tel:+919876543210", color: "from-teal-500 to-teal-700" },
  { icon: Mail, label: "Email Us", value: "hello@boomerangtravel.com", href: "mailto:hello@boomerangtravel.com", color: "from-amber-400 to-amber-600" },
  { icon: MapPin, label: "Visit Us", value: "Level 12, Cyber Hub, DLF Phase 2, Gurugram — 122002", href: "#", color: "from-teal-600 to-teal-800" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat: 9AM–8PM IST\nSunday: 10AM–5PM IST", href: "#", color: "from-amber-500 to-amber-700" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", destination: "", date: "", travellers: "2", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.submitInquiry({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        package_name: form.destination,
        travel_date: form.date,
        travellers: form.travellers,
        budget_range: form.budget,
        message: form.message,
        type: "custom",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300";

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 py-16 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">Plan Your Dream Trip</h1>
          <p className="text-teal-200 mt-3 max-w-xl mx-auto">Send us an inquiry and our travel experts will craft a personalized itinerary within 24 hours.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Contact Information</h2>
            {contactInfo.map((c, i) => (
              <motion.a key={i} href={c.href} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">{c.label}</div>
                  <div className="text-gray-800 text-sm font-semibold mt-0.5 whitespace-pre-line">{c.value}</div>
                </div>
              </motion.a>
            ))}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Inquiry Received!</h3>
                  <p className="text-gray-500 mt-3 max-w-md mx-auto">Our travel expert will contact you within 24 hours to craft your perfect itinerary.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors">
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-gray-900 mb-6">Trip Inquiry Form</h2>
                  {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Full Name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Dream Destination</label>
                      <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Bali, Europe, Japan..." className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Travel Date</label>
                      <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Travellers</label>
                      <select name="travellers" value={form.travellers} onChange={handleChange} className={inputClass}>
                        {[1, 2, 3, 4, 5, 6, "7+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Budget per Person</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
                        <option value="">Select budget range</option>
                        <option>Under $1,000</option>
                        <option>$1,000 – $2,000</option>
                        <option>$2,000 – $3,500</option>
                        <option>$3,500 – $5,000</option>
                        <option>$5,000+</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tell Us About Your Dream Trip</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Any special interests, occasions, or questions..." className={`${inputClass} resize-none`} />
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-base disabled:opacity-60">
                        <Send className="w-5 h-5" /> {submitting ? "Sending..." : "Send My Inquiry"}
                      </button>
                      <p className="text-xs text-gray-400 text-center mt-3">We'll respond within 24 hours. No spam, ever.</p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

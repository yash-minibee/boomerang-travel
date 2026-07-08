import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ChevronDown } from "lucide-react";
import { api } from "../api/api";
import usePageContent from "../hooks/usePageContent";
import { useSettings } from "../context/SettingsContext";

const faqs = [
  {
    q: "How do I start planning my customized tour?",
    a: "Simply fill out our trip inquiry form or send us a WhatsApp message. One of our dedicated travel experts will get in touch with you within 24 hours to discuss your preferences, suggest itineraries, and refine details until you are completely satisfied."
  },
  {
    q: "What is typically included in your tour packages?",
    a: "Our custom packages generally include premium accommodation, daily breakfast, airport transfers, domestic transport, guided sightseeing tours, and entrance tickets. International flights and optional activities can be added upon request."
  },
  {
    q: "Can I make changes to my itinerary after booking?",
    a: "Absolutely! We understand that plans can change. While minor adjustments can be made at any time, major changes (like accommodation or flight dates) are subject to availability and any change fees from our partners."
  },
  {
    q: "Do you provide visa assistance?",
    a: "Yes, we provide comprehensive visa guidance and document checklists for all destinations. While we assist you throughout the application process, final approval remains with the respective embassies."
  },
  {
    q: "What is your cancellation and refund policy?",
    a: "Our cancellation policies vary based on the specific hotels, airlines, and travel dates. Detailed policies will be shared with you at the time of sending the quote. We highly recommend purchasing travel insurance."
  },
  {
    q: "How do I make payments for my booking?",
    a: "We accept payments via bank transfer, credit/debit cards, and digital wallets. Typically, a 30-50% deposit is required to confirm bookings, with the remaining balance due 3-4 weeks prior to departure."
  }
];

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", country: "", email: "", phone: "", destination: "", date: "", travellers: "", children: "0", budget: "", message: "", inquiry_type: "package" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      api.getDestinations().then(res => res.data ?? []),
      api.getCruiseDestinations().then(res => res.data ?? []).catch(() => [])
    ]).then(([dests, cruises]) => {
      const combined = [
        ...dests.map(d => ({ id: `pkg-${d.id}`, name: d.name, type: 'Package' })),
        ...cruises.map(c => ({ id: `cru-${c.id}`, name: c.name, type: 'Cruise Port' }))
      ];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
      setDestinations(unique);
    }).catch(err => console.warn("Failed to load destinations for contact page:", err));
  }, []);

  const defaultContent = {
    contact_title: "Plan Your Dream Trip",
    contact_subtitle: "Send us an inquiry and our travel experts will craft a personalized itinerary within 24 hours.",
    phone: "+91 98765 43210",
    email: "hello@boomerangtravel.com",
    address: "Level 12, Cyber Hub, DLF Phase 2, Gurugram — 122002",
    office_hours: "Mon–Sat: 9AM–8PM IST\nSunday: 10AM–5PM IST"
  };

  const { content } = usePageContent("contact", defaultContent);

  const contactInfoList = [
    { icon: Phone, label: "Call Us", value: content.phone, href: `tel:${(content.phone || "").replace(/\s+/g, '')}`, color: "from-teal-500 to-teal-700" },
    { icon: Mail, label: "Email Us", value: content.email, href: `mailto:${content.email}`, color: "from-amber-400 to-amber-600" },
    { icon: MapPin, label: "Visit Us", value: content.address, href: "#", color: "from-teal-600 to-teal-800" },
    { icon: Clock, label: "Office Hours", value: content.office_hours, href: "#", color: "from-amber-500 to-amber-700" },
  ].filter(c => c.value && c.value.trim() !== "");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.submitInquiry({
        customer_name: form.name,
        customer_country: form.country,
        customer_email: form.email,
        customer_phone: form.phone,
        package_name: form.destination,
        travel_date: form.date,
        travellers: form.travellers,
        children: form.children,
        budget_range: form.budget,
        message: form.message,
        type: form.inquiry_type === "cruise" ? "custom_cruise" : "custom_package",
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
    <div className="min-h-screen bg-stone-50 pt-20 lg:pt-24">
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 py-16 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">{content.contact_title}</h1>
          <p className="text-teal-200 mt-3 max-w-xl mx-auto">{content.contact_subtitle}</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Contact Information</h2>
            {contactInfoList.map((c, i) => (
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
            <a href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
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
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Country of residence *</label>
                      <input required name="country" value={form.country} onChange={handleChange} placeholder="e.g. India, USA, UK" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Phone Number *</label>
                      <input required name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Inquiry For *</label>
                      <select required name="inquiry_type" value={form.inquiry_type} onChange={handleChange} className={inputClass}>
                        <option value="package">Holiday Tour Package</option>
                        <option value="cruise">Cruise Trip</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Dream Destination / Port *</label>
                      <SearchableDestinationInput
                        destinations={destinations}
                        value={form.destination}
                        onChange={(val) => setForm(f => ({ ...f, destination: val }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Travel Date *</label>
                      <input required type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">No. of Adults *</label>
                      <select required name="travellers" value={form.travellers} onChange={handleChange} className={inputClass}>
                        <option value="">Select number of adults</option>
                        {[1, 2, 3, 4, 5, 6, "7+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">No. of Children</label>
                      <select name="children" value={form.children} onChange={handleChange} className={inputClass}>
                        {[0, 1, 2, 3, 4, 5, "6+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Child" : "Children"}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Budget per Person</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
                        <option value="">Select budget range</option>
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 – $2,000">$1,000 – $2,000</option>
                        <option value="$2,000 – $3,500">$2,000 – $3,500</option>
                        <option value="$3,500 – $5,000">$3,500 – $5,000</option>
                        <option value="$5,000+">$5,000+</option>
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

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <div className="bg-white border-t border-gray-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">FAQ</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 mt-3">Find quick answers to common questions about planning, bookings, and our travel services.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-stone-50/50 hover:bg-stone-50 transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left px-6 py-5 font-semibold text-gray-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-teal-600" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

function SearchableDestinationInput({ destinations, value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const containerRef = useRef(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <input
        required
        type="text"
        placeholder="Type to search destinations / ports..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className={className}
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-1">
          {filtered.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSearch(d.name);
                onChange(d.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="font-semibold">{d.name}</span>
              <span className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">{d.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

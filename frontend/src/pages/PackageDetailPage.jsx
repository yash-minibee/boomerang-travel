import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Star, MapPin, Check, X, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Phone, Mail, Calendar, Users,
  Utensils, Activity, MessageCircle, ArrowRight
} from "lucide-react";
import PackageCard from "../components/PackageCard";
import { api, imageUrl } from "../api/api";
import { useSettings } from "../context/SettingsContext";

function mapPkg(pkg) {
  return {
    ...pkg,
    startingPrice: Number(pkg.starting_price),
    reviews: pkg.review_count,
    tag: pkg.tags?.[0] ?? null,
    destinations: [pkg.destination_region ?? ""],
    days: parseInt(pkg.duration) || 0,
    image: imageUrl(pkg.cover_image),
  };
}

export default function PackageDetailPage() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", travellers: "2", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); setActiveImg(0); }, [slug]);

  useEffect(() => {
    setLoading(true);
    api.getPackage(slug)
      .then(res => setPkg(mapPkg(res.data)))
      .catch(() => navigate("/packages"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    api.getPackages({ status: "active", limit: 4 })
      .then(res => setRelated((res.data ?? []).filter(p => p.slug !== slug).slice(0, 3).map(mapPkg)))
      .catch(console.error);
  }, [slug]);

  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitInquiry({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        travel_date: form.date,
        travellers: form.travellers,
        message: form.message,
        package_name: pkg?.title,
        package_id: pkg?.id,
        type: "package",
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 pt-20 lg:pt-24">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!pkg) return null;

  // Build gallery — resolve all URLs, fallback to cover image
  const gallery = (pkg.gallery?.length ? pkg.gallery : pkg.image ? [pkg.image] : [])
    .map(imageUrl).filter(Boolean);

  // Only show policies that have content
  const policies = [
    { key: "cancellation", label: "Cancellation Policy", content: pkg.policy_cancellation },
    { key: "refund",       label: "Refund Policy",       content: pkg.policy_refund },
    { key: "payment",      label: "Payment Policy",      content: pkg.policy_payment },
  ].filter(p => p.content?.trim());

  const hasInclusions = pkg.inclusions?.length > 0;
  const hasExclusions = pkg.exclusions?.length > 0;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 lg:pt-24">

      {/* ── Hero Gallery ────────────────────────────────────────── */}
      <div className="relative h-[55vh] lg:h-[65vh] overflow-hidden bg-teal-950">
        {gallery.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={gallery[activeImg]}
              alt={pkg.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-800 to-teal-950" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/20 to-transparent" />

        {gallery.length > 1 && (
          <>
            <button onClick={() => setActiveImg(i => (i - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-amber-500/80 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveImg(i => (i + 1) % gallery.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-amber-500/80 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`rounded-full transition-all ${i === activeImg ? "w-6 h-2.5 bg-amber-400" : "w-2.5 h-2.5 bg-white/50"}`} />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <nav className="text-white/60 text-xs mb-3 flex items-center gap-1.5">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-amber-300">Packages</Link>
            <span>/</span>
            <span className="text-white">{pkg.title}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white/80 text-sm"><Clock className="w-4 h-4" /> {pkg.duration}</div>
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-white">{pkg.rating}</span>
              <span className="text-white/60">({pkg.reviews} reviews)</span>
            </div>
            {pkg.tag && <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">{pkg.tag}</span>}
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Destination Route — only when itinerary has cities */}
            {(() => {
              if (!pkg.itinerary?.length) return null;
              const cities = [...new Map(
                pkg.itinerary.map(d => [d.city, d.city])
              ).entries()]
                .map(([c]) => c)
                .filter(Boolean);
              if (!cities.length) return null;
              return (
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-5">Destination Route</h2>
                  <div className="flex items-center gap-0 overflow-x-auto pb-2">
                    {cities.map((city, i) => (
                      <div key={i} className="flex items-center shrink-0">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            {i + 1}
                          </div>
                          <span className="text-xs text-gray-600 font-semibold mt-1.5 text-center max-w-[80px]">{city}</span>
                        </div>
                        {i < cities.length - 1 && (
                          <div className="flex items-center mx-1 mb-4">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-amber-300 to-amber-400" />
                            <ArrowRight className="w-3 h-3 text-amber-500 -ml-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Trip Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 bg-teal-50 rounded-2xl p-4">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-100" />
                  <div className="space-y-6">
                    {pkg.itinerary.map((day, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20px" }} transition={{ delay: i * 0.04 }} className="flex gap-5">
                        <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow-md">
                          {day.day_number}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-5 hover:bg-amber-50/40 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{day.title}</h3>
                            {day.city && (
                              <span className="text-xs bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full shrink-0 font-medium">
                                <MapPin className="w-3 h-3 inline mr-0.5" />{day.city}
                              </span>
                            )}
                          </div>
                          {day.description && <p className="text-gray-600 text-sm leading-relaxed mb-3">{day.description}</p>}
                          <div className="flex flex-wrap gap-2">
                            {day.meals?.length > 0 && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white rounded-xl px-2.5 py-1.5">
                                <Utensils className="w-3.5 h-3.5 text-amber-500" />{day.meals.join(", ")}
                              </div>
                            )}
                            {day.transport?.length > 0 && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white rounded-xl px-2.5 py-1.5">
                                <Activity className="w-3.5 h-3.5 text-blue-500" />{day.transport.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Hotels */}
            {pkg.hotels?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Hotel Stay</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {pkg.hotels.map((hotel, i) => {
                    const hotelImg = imageUrl(hotel.image_url);
                    return (
                      <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
                        <div className="h-40 overflow-hidden bg-teal-50">
                          {hotelImg ? (
                            <img src={hotelImg} alt={hotel.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-400 text-3xl font-bold">
                              {hotel.name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900 text-sm">{hotel.name}</h4>
                            <div className="flex gap-0.5">
                              {Array.from({ length: Number(hotel.star_rating) || 0 }).map((_, si) => (
                                <Star key={si} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          {hotel.city && (
                            <p className="text-xs text-teal-600 font-medium mb-3 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {hotel.city}
                            </p>
                          )}
                          {hotel.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {hotel.amenities.map(a => (
                                <span key={a} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            {(hasInclusions || hasExclusions) && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Inclusions & Exclusions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {hasInclusions && (
                    <div>
                      <h3 className="text-teal-700 font-bold text-sm mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4" /> What's Included
                      </h3>
                      <ul className="space-y-2.5">
                        {pkg.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-teal-600" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {hasExclusions && (
                    <div>
                      <h3 className="text-red-500 font-bold text-sm mb-3 flex items-center gap-2">
                        <X className="w-4 h-4" /> What's Excluded
                      </h3>
                      <ul className="space-y-2.5">
                        {pkg.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Policies */}
            {policies.length > 0 && (
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Policies</h2>
                <div className="space-y-3">
                  {policies.map(item => (
                    <div key={item.key} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button onClick={() => setActiveAccordion(activeAccordion === item.key ? null : item.key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-50 transition-colors">
                        <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                        {activeAccordion === item.key
                          ? <ChevronUp className="w-4 h-4 text-amber-500" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      <AnimatePresence>
                        {activeAccordion === item.key && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.content}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sticky Inquiry Card ───────────────────────────────── */}
          <aside className="lg:w-96 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white">
                  <div className="text-sm text-teal-200">Starting from</div>
                  <div className="text-3xl font-extrabold">${pkg.startingPrice.toLocaleString()}</div>
                  <div className="text-teal-200 text-sm">per person</div>
                  <div className="flex items-center gap-2 mt-2 text-teal-200 text-sm">
                    <Clock className="w-4 h-4" /> {pkg.duration}
                    <span className="mx-1">•</span>
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span className="text-white font-semibold">{pkg.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <div className="text-4xl mb-3">🎉</div>
                      <h3 className="font-bold text-gray-900">Inquiry Sent!</h3>
                      <p className="text-gray-500 text-sm mt-2">Our expert will contact you within 24 hours.</p>
                      <button onClick={() => setSubmitted(false)} className="mt-4 text-teal-600 text-sm font-semibold hover:underline">Send another</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="font-bold text-gray-900">Send Inquiry</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name *</label>
                          <input required name="name" value={form.name} onChange={handleFormChange} placeholder="Your full name"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email *</label>
                          <input required type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="you@email.com"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Phone</label>
                          <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+91..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Travel Date</label>
                          <input type="date" name="date" value={form.date} onChange={handleFormChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Travellers</label>
                          <select name="travellers" value={form.travellers} onChange={handleFormChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300">
                            {[1, 2, 3, 4, 5, 6, "7+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Message</label>
                          <textarea name="message" value={form.message} onChange={handleFormChange}
                            placeholder="Any special requirements..." rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
                        </div>
                      </div>
                      <button type="submit" disabled={submitting}
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                        <Mail className="w-4 h-4" /> {submitting ? "Sending..." : "Send Inquiry"}
                      </button>
                      <a href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, "")}?text=Hi! I'm interested in the ${encodeURIComponent(pkg.title)} package.`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all">
                        <MessageCircle className="w-4 h-4" /> WhatsApp Now
                      </a>
                      <a href={`tel:${(settings.phone || "").replace(/\s+/g, "")}`}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-amber-400 text-gray-700 font-semibold py-3 rounded-2xl text-sm transition-colors">
                        <Phone className="w-4 h-4 text-amber-500" /> Call Us
                      </a>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Packages */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, X, Trash2, Edit, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DeleteModal from "../components/ui/DeleteModal";
import { testimonialsAPI } from "../api/api";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await testimonialsAPI.listAll();
      setTestimonials(res.data ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try { await testimonialsAPI.updateStatus(id, status); load(); }
    catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    try { await testimonialsAPI.delete(deleteTarget); load(); }
    catch (e) { console.error(e); }
    finally { setDeleteTarget(null); }
  };

  const handleSave = async (id, data) => {
    try {
      if (id) {
        await testimonialsAPI.update(id, data);
      } else {
        await testimonialsAPI.submit(data);
      }
      load();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const filtered = filter === "All" ? testimonials : testimonials.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        subtitle={`${testimonials.length} total reviews`}
        action={
          <button onClick={() => { setEditTarget(null); setShowFormModal(true); }} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        }
      />

      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Approved", "Rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f ? "bg-teal-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">{t.customer_name?.[0]}</div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{t.customer_name}</p>
                    <p className="text-xs text-gray-400">{t.customer_location}</p>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className={`w-4 h-4 ${si < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                ))}
              </div>

              <p className="text-sm text-gray-600 italic mb-3 line-clamp-3">"{t.review_text}"</p>
              <p className="text-xs text-teal-600 font-medium mb-4">{t.package_name}</p>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {t.status !== "Approved" && (
                  <button onClick={() => updateStatus(t.id, "Approved")} className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-600 font-semibold text-xs py-2 rounded-xl transition-colors">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {t.status !== "Rejected" && (
                  <button onClick={() => updateStatus(t.id, "Rejected")} className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-xs py-2 rounded-xl transition-colors">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                {t.status !== "Pending" && (
                  <button onClick={() => updateStatus(t.id, "Pending")} className="flex-1 text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 py-2 rounded-xl font-medium transition-colors">
                    Reset
                  </button>
                )}
                <button onClick={() => { setEditTarget(t); setShowFormModal(true); }} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-teal-50 hover:text-teal-600 transition-colors text-gray-500" title="Edit Testimonial">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(t.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500" title="Delete Testimonial">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">No testimonials found.</div>}
        </div>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial" message="This will permanently delete the review." />
      
      <TestimonialFormModal
        open={showFormModal}
        onClose={() => { setEditTarget(null); setShowFormModal(false); }}
        testimonial={editTarget}
        onSave={handleSave}
      />
    </div>
  );
}

// Testimonial details Add/Edit modal form component
function TestimonialFormModal({ open, onClose, testimonial, onSave }) {
  const isEdit = Boolean(testimonial);
  const [customerName, setCustomerName] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [packageName, setPackageName] = useState("");
  const [status, setStatus] = useState("Approved");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setCustomerName(testimonial.customer_name ?? "");
      setCustomerLocation(testimonial.customer_location ?? "");
      setRating(Number(testimonial.rating ?? 5));
      setReviewText(testimonial.review_text ?? "");
      setPackageName(testimonial.package_name ?? "");
      setStatus(testimonial.status ?? "Pending");
    } else {
      setCustomerName("");
      setCustomerLocation("");
      setRating(5);
      setReviewText("");
      setPackageName("");
      setStatus("Approved");
    }
  }, [testimonial, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) return;
    setSaving(true);
    try {
      await onSave(testimonial?.id, {
        customer_name: customerName,
        customer_location: customerLocation,
        rating: Number(rating),
        review_text: reviewText,
        package_name: packageName,
        status: status
      });
      onClose();
    } catch (err) {
      alert("Error saving testimonial: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full z-[101] max-h-[90vh] overflow-y-auto"
          >
            <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{isEdit ? "Edit Testimonial" : "Add Testimonial"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Customer Name *</label>
                <input
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Location</label>
                <input
                  value={customerLocation}
                  onChange={e => setCustomerLocation(e.target.value)}
                  placeholder="e.g. New York, USA"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Rating (1-5)</label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Package Name</label>
                <input
                  value={packageName}
                  onChange={e => setPackageName(e.target.value)}
                  placeholder="e.g. European Grand Tour"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Review Text *</label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50">
                  {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Check, X, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DeleteModal from "../components/ui/DeleteModal";
import { testimonialsAPI } from "../api/api";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const filtered = filter === "All" ? testimonials : testimonials.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" subtitle={`${testimonials.length} total reviews`} />

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
                <button onClick={() => setDeleteTarget(t.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">No testimonials found.</div>}
        </div>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial" message="This will permanently delete the review." />
    </div>
  );
}

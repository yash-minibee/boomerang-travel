import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Calendar, Users, MessageSquare, Globe, DollarSign } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import Pagination from "../components/ui/Pagination";
import { inquiriesAPI } from "../api/api";

const STATUSES = ["All", "New", "Contacted", "Proposal Sent", "Confirmed", "Closed"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (statusFilter !== "All") params.status = statusFilter;
      const res = await inquiriesAPI.list(params);
      setInquiries(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await inquiriesAPI.updateStatus(id, status);
      load();
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
    } catch (e) { console.error(e); }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" subtitle={`${total} total inquiries`} />

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by customer or package..." />
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-gray-400">{total} inquiries</span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["ID", "Customer", "Package", "Travel Date", "Travellers", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-14"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : inquiries.map((inq, i) => (
                <motion.tr key={inq.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-xs text-gray-400 font-mono">#{inq.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">{inq.customer_name?.[0]}</div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{inq.customer_name}</p>
                        <p className="text-xs text-gray-400">{inq.customer_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[160px] truncate">{inq.package_name}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{inq.travel_date ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{inq.travellers ?? "—"}</td>
                  <td className="px-5 py-4"><StatusBadge status={inq.status} /></td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelected(inq)} className="text-xs text-teal-600 font-semibold hover:text-teal-700 border border-teal-200 hover:border-teal-400 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
              {!loading && inquiries.length === 0 && (
                <tr><td colSpan={7} className="text-center py-14 text-gray-400">No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-bold text-gray-900">Inquiry #{selected.id}</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">{selected.customer_name?.[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selected.customer_name}</h3>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Email", value: selected.customer_email },
                    { icon: Phone, label: "Phone", value: selected.customer_phone || "—" },
                    { icon: Globe, label: "Country of Residence", value: selected.customer_country || "—" },
                    { icon: Calendar, label: "Travel Date", value: selected.travel_date || "—" },
                    { icon: Users, label: "Travellers", value: selected.travellers ? `${selected.travellers} Travellers` : "—" },
                    { icon: DollarSign, label: "Budget per Person", value: selected.budget_range || "—" },
                    { icon: MessageSquare, label: "Destination / Package", value: selected.package_name || "—" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <Icon className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.message && (
                  <div className="bg-amber-50 rounded-2xl p-4">
                    <p className="text-xs text-amber-700 font-semibold mb-1.5">Message</p>
                    <p className="text-sm text-gray-700 italic">"{selected.message}"</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["New", "Contacted", "Proposal Sent", "Confirmed", "Closed"].map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${selected.status === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <a href={`tel:${selected.customer_phone}`} className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-teal-400 text-gray-700 font-semibold py-3 rounded-2xl text-sm transition-colors">
                    <Phone className="w-4 h-4 text-teal-600" /> Call
                  </a>
                  <a href={`https://wa.me/${(selected.customer_phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl text-sm transition-colors">
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

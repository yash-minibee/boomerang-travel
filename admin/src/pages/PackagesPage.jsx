import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Star, ToggleLeft, ToggleRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import DeleteModal from "../components/ui/DeleteModal";
import Pagination from "../components/ui/Pagination";
import { packagesAPI, imageUrl } from "../api/api";

const destinations = ["All", "Asia", "Africa", "North America", "South America", "Antarctica", "Europe", "Australia/Oceania"];
const statuses = ["All", "active", "draft"];

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [destFilter, setDestFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 8;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (destFilter !== "All") params.destination = destFilter;
      if (statusFilter !== "All") params.status = statusFilter;
      const res = await packagesAPI.list(params);
      setPackages(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search, destFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    try { await packagesAPI.delete(deleteTarget); load(); }
    catch (e) { console.error(e); }
    finally { setDeleteTarget(null); }
  };

  const toggleFeatured = async (id) => {
    try { await packagesAPI.toggleFeatured(id); load(); }
    catch (e) { console.error(e); }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      <PageHeader title="Packages" subtitle={`${total} total packages`}
        action={
          <Link to="/packages/add" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add Package
          </Link>
        }
      />

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search packages..." />
        <select value={destFilter} onChange={e => { setDestFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white">
          {destinations.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-sm text-gray-400">{total} results</span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Package", "Destination", "Duration", "Price", "Status", "Featured", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-14"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : packages.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-14 text-gray-400">No packages found.</td></tr>
              ) : packages.map((pkg, i) => (
                <motion.tr key={pkg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Cover image thumbnail */}
                      <div className="w-14 h-10 rounded-xl overflow-hidden shrink-0 bg-teal-50">
                        {pkg.cover_image ? (
                          <img
                            src={imageUrl(pkg.cover_image)}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-500 font-bold text-sm">
                            {pkg.title?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{pkg.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-400">{pkg.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pkg.destination_region}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pkg.duration}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${Number(pkg.starting_price).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={pkg.status === "active" ? "Active" : "Draft"} /></td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleFeatured(pkg.id)} className="text-teal-600 hover:text-amber-500 transition-colors">
                      {Number(pkg.featured) ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/packages/${pkg.id}/edit`} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-500">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(pkg.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Package" message="This will permanently delete the package." />
    </div>
  );
}

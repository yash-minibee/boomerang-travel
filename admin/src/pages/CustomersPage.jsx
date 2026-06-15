import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eye, DollarSign } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import Pagination from "../components/ui/Pagination";
import { customersAPI } from "../api/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await customersAPI.list(params);
      setCustomers(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" subtitle={`${total} total customers`} />

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 items-center">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search customers..." />
        <span className="ml-auto text-sm text-gray-400">{total} results</span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Customer", "Email", "Phone", "Total Spent", "Last Activity", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-14"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : customers.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">{c.name?.[0]}</div>
                      <span className="font-semibold text-sm text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{c.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      <DollarSign className="w-3.5 h-3.5 text-green-500" />{Number(c.total_spent || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{c.last_activity?.slice(0, 10) ?? "—"}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4">
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-teal-50 hover:text-teal-600 transition-colors text-gray-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {!loading && customers.length === 0 && (
                <tr><td colSpan={7} className="text-center py-14 text-gray-400">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">Page {page} of {Math.max(1, Math.ceil(total / LIMIT))}</span>
          <Pagination current={page} total={Math.max(1, Math.ceil(total / LIMIT))} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

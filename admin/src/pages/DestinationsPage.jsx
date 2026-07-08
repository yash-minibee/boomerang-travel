import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, MapPin, Package } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import DeleteModal from "../components/ui/DeleteModal";
import Pagination from "../components/ui/Pagination";
import { destinationsAPI, imageUrl } from "../api/api";


export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const LIMIT = 8;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await destinationsAPI.list(params);
      setDestinations(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    try { await destinationsAPI.delete(deleteTarget); load(); }
    catch (e) { console.error(e); }
    finally { setDeleteTarget(null); }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      <PageHeader title="Destinations" subtitle={`${total} destinations`}
        action={
          <Link to="/destinations/add" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add Destination
          </Link>
        }
      />
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 items-center">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search destinations..." />
        <span className="ml-auto text-sm text-gray-400">{total} results</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {destinations.map((dest, i) => {
            const imgSrc = imageUrl(dest.hero_image);
            return (
              <motion.div key={dest.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="relative h-44 overflow-hidden bg-teal-50">
                  {imgSrc ? (
                    <img src={imgSrc} alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-200">
                      <MapPin className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 to-transparent" />
                  {Number(dest.featured) === 1 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-base">{dest.name}</h3>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{dest.country}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {Number(dest.package_count) || 0} packages
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/destinations/${dest.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-500">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => setDeleteTarget(dest.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {destinations.length === 0 && (
            <div className="col-span-4 text-center py-16 text-gray-400">No destinations found.</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-3xl mt-6">
        <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Destination" message="This will permanently delete the destination." />
    </div>
  );
}
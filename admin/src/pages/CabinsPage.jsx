import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Bed, Star, Tag, Users, Maximize2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import DeleteModal from "../components/ui/DeleteModal";
import Pagination from "../components/ui/Pagination";
import { cabinsGlobalAPI, imageUrl } from "../api/api";

export default function CabinsPage() {
  const [cabins, setCabins] = useState([]);
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
      const res = await cabinsGlobalAPI.list(params);
      setCabins(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    try {
      await cabinsGlobalAPI.delete(deleteTarget);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Cabins"
        subtitle={`${total} cabins in database`}
        action={
          <Link
            to="/cabins/add"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Cabin
          </Link>
        }
      />

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 items-center">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search cabins..."
        />
        <span className="ml-auto text-sm text-gray-400">{total} results</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cabins.map((cabin, i) => {
            const imgSrc = imageUrl(cabin.image_url);
            return (
              <motion.div
                key={cabin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full"
              >
                <div className="relative h-44 overflow-hidden bg-teal-50 shrink-0">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={cabin.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-200">
                      <Bed className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 to-transparent" />
                  <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{cabin.star_rating} Star</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-base">{cabin.name}</h3>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                      <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {cabin.type || 'Cabin'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  {/* Capacity & Size */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-b border-gray-50 pb-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>{cabin.capacity || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{cabin.size || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex-1">
                    <span className="text-xs text-gray-400 font-semibold block mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-teal-600" /> Amenities
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(cabin.amenities ?? []).slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100"
                        >
                          {a}
                        </span>
                      ))}
                      {(cabin.amenities ?? []).length > 4 && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          +{(cabin.amenities ?? []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                    <Link
                      to={`/cabins/${cabin.id}/edit`}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-500"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(cabin.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors text-gray-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      )}

      <DeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Cabin"
        message="Are you sure you want to delete this cabin from the database? This action cannot be undone."
      />
    </div>
  );
}

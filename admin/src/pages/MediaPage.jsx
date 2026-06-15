import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Copy, X, Check, Image } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { mediaAPI } from "../api/api";

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try { const res = await mediaAPI.list(); setMedia(res.data ?? []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "media");
      await mediaAPI.upload(fd);
      load();
    } catch (err) { alert(err.message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    try { await mediaAPI.delete(id); load(); if (preview?.id === id) setPreview(null); }
    catch (e) { console.error(e); }
  };

  const copyUrl = (item) => {
    navigator.clipboard.writeText(item.url || `http://localhost:8000/${item.file_path}`);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getUrl = (item) => item.url || `http://localhost:8000/${item.file_path}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Media Library" subtitle={`${media.length} files`}
        action={
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
          </button>
        }
      />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />

      <label className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-teal-300 transition-colors cursor-pointer bg-white flex flex-col items-center gap-2"
        onClick={() => fileRef.current?.click()}>
        <Upload className="w-8 h-8 text-gray-300" />
        <p className="text-gray-500 font-medium text-sm">Drag & drop or click to upload</p>
        <p className="text-gray-400 text-xs">PNG, JPG, WebP — max 5MB</p>
      </label>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {media.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
              <div className="relative overflow-hidden" onClick={() => setPreview(item)}>
                <img src={getUrl(item)} alt={item.original_name} className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button onClick={e => { e.stopPropagation(); copyUrl(item); }}
                      className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow hover:bg-amber-50 transition-colors">
                      {copied === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-700" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-600 font-medium truncate">{item.original_name}</p>
                <p className="text-xs text-gray-400">{item.file_size ? `${Math.round(item.file_size / 1024)} KB` : ""}</p>
              </div>
            </motion.div>
          ))}
          {media.length === 0 && <p className="col-span-5 text-center text-gray-400 py-12">No files uploaded yet.</p>}
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80" onClick={() => setPreview(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-3xl w-full z-10">
              <img src={getUrl(preview)} alt={preview.original_name} className="w-full rounded-3xl shadow-2xl" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => copyUrl(preview)} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl shadow hover:bg-white">
                  {copied === preview.id ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy URL</>}
                </button>
                <button onClick={() => setPreview(null)} className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl shadow hover:bg-white">
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

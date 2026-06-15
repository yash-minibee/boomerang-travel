import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

export default function DeleteModal({ open, onClose, onConfirm, title = "Delete Item", message = "Are you sure? This action cannot be undone." }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl transition-colors text-sm">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

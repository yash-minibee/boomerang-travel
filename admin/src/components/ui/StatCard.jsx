import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, color, growth, prefix = "", suffix = "" }) {
  const isPositive = growth >= 0;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="text-sm text-gray-400 mt-1">{title}</div>
      </div>
    </motion.div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === current ? "bg-teal-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}

import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white w-full sm:w-64"
      />
    </div>
  );
}

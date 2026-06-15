export function FormInput({ label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-gray-700 block">{label}</label>}
      <input
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300 transition-all ${error ? "border-red-300" : "border-gray-200"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, error, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-gray-700 block">{label}</label>}
      <select
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300 transition-all bg-white ${error ? "border-red-300" : "border-gray-200"}`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-gray-700 block">{label}</label>}
      <textarea
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-none transition-all ${error ? "border-red-300" : "border-gray-200"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

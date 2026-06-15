const configs = {
  New:           "bg-blue-100 text-blue-700",
  Contacted:     "bg-amber-100 text-amber-700",
  "Proposal Sent": "bg-purple-100 text-purple-700",
  Confirmed:     "bg-green-100 text-green-700",
  Closed:        "bg-gray-100 text-gray-500",
  Active:        "bg-green-100 text-green-700",
  Draft:         "bg-gray-100 text-gray-500",
  Inactive:      "bg-red-100 text-red-500",
  VIP:           "bg-amber-100 text-amber-700",
  Approved:      "bg-green-100 text-green-700",
  Pending:       "bg-amber-100 text-amber-700",
  Rejected:      "bg-red-100 text-red-500",
  Published:     "bg-green-100 text-green-700",
};

export default function StatusBadge({ status }) {
  const cls = configs[status] || "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

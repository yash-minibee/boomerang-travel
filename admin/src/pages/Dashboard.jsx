import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, MessageSquare, Users, DollarSign, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import { dashboardAPI, inquiriesAPI, packagesAPI } from "../api/api";

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } });

function MiniBar({ value, max, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function Spinner() {
  return <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.stats(),
      dashboardAPI.revenue(),
      inquiriesAPI.list({ limit: 5 }),
      packagesAPI.list({ limit: 4, sort: "rating", order: "desc" }),
    ]).then(([s, r, inq, pkg]) => {
      setStats(s.data);
      setRevenue(r.data ?? []);
      setInquiries(inq.data ?? []);
      setPackages(pkg.data ?? []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const maxRevenue = revenue.length ? Math.max(...revenue.map(d => d.revenue || 0), 1) : 1;

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp()}>
        <h1 className="text-2xl font-extrabold text-gray-900">Good morning 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening with Boomerang today.</p>
      </motion.div>

      {stats && (
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard title="Total Packages"     value={stats.total_packages}     icon={Package}      color="bg-gradient-to-br from-teal-500 to-teal-700" />
          <StatCard title="Total Destinations" value={stats.total_destinations}  icon={MapPin}       color="bg-gradient-to-br from-amber-400 to-amber-600" />
          <StatCard title="Total Inquiries"    value={stats.total_inquiries}     icon={MessageSquare} color="bg-gradient-to-br from-teal-600 to-teal-800" />
          <StatCard title="Total Customers"    value={stats.total_customers}     icon={Users}        color="bg-gradient-to-br from-amber-500 to-amber-700" />
          <StatCard title="New Inquiries"      value={stats.new_inquiries}       icon={DollarSign}   color="bg-gradient-to-br from-teal-700 to-teal-900" />
          <StatCard title="Pending Reviews"    value={stats.pending_testimonials} icon={TrendingUp}  color="bg-gradient-to-br from-amber-400 to-amber-500" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div {...fadeUp(0.1)} className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-gray-400 text-sm">Last 6 months</p>
            </div>
          </div>
          {revenue.length > 0 ? (
            <div className="flex items-end gap-3 h-48">
              {revenue.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${((d.revenue || 0) / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-teal-700 to-teal-500 min-h-[4px] relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${((d.revenue || 0) / 1000).toFixed(0)}k
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-400 font-medium">{d.month?.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No revenue data yet.</div>
          )}
        </motion.div>

        {/* Top Packages */}
        <motion.div {...fadeUp(0.15)} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Top Packages</h2>
            <Link to="/packages" className="text-teal-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4">
            {packages.map(pkg => (
              <div key={pkg.id} className="flex items-center gap-3">
                <div className="w-12 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0 text-teal-600 font-bold text-xs">
                  #{pkg.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{pkg.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-400">{pkg.rating}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 shrink-0">${Number(pkg.starting_price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Inquiries */}
      <motion.div {...fadeUp(0.2)} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Inquiries</h2>
          <Link to="/inquiries" className="text-teal-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Package</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inq, i) => (
                <motion.tr key={inq.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">
                        {inq.customer_name?.[0]}
                      </div>
                      <span className="font-medium text-sm text-gray-800">{inq.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell truncate max-w-[160px]">{inq.package_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">{inq.created_at?.slice(0, 10)}</td>
                  <td className="px-6 py-4"><StatusBadge status={inq.status} /></td>
                </motion.tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-sm">No inquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

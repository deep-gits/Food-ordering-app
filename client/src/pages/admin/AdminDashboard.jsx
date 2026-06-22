import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, UtensilsCrossed, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';
import { useState } from 'react';
import { format } from 'date-fns';
import Loader from '../../components/common/Loader';

const statusStyle = {
  processing:      'badge-orange',
  confirmed:       'badge-blue',
  preparing:       'badge-blue',
  out_for_delivery:'badge-blue',
  delivered:       'badge-green',
  cancelled:       'badge-red',
};

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const cards = [
    { label: 'Total Revenue',   value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`, Icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Orders',    value: stats?.totalOrders    || 0,                       Icon: ShoppingBag, color: 'text-brand-400',   bg: 'bg-brand-500/10  border-brand-500/20'   },
    { label: 'Menu Items',      value: stats?.totalMenuItems || 0,                       Icon: UtensilsCrossed, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Customers',       value: stats?.totalUsers     || 0,                       Icon: Users,      color: 'text-blue-400',    bg: 'bg-blue-500/10   border-blue-500/20'   },
  ];

  return (
    <div className="min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">Admin Panel</p>
            <h1 className="section-title text-3xl">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/menu"   className="btn-secondary text-sm">Manage Menu</Link>
            <Link to="/admin/orders" className="btn-primary  text-sm">View Orders</Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map(({ label, value, Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">{label}</p>
                  <p className="font-display font-bold text-3xl text-white">{value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-emerald-400 text-xs">
                <TrendingUp size={11} /> <span>Live data</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-surface-border">
            <h2 className="font-semibold text-white text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="btn-ghost text-brand-400 text-sm">
              View All <Eye size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-border">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-elevated transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-white">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 text-gray-500">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-brand-400 font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={statusStyle[order.orderStatus] || 'badge-gray'}>
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminGetOrders, adminUpdateOrder } from '../../services/adminService';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';

const ORDER_STATUSES = ['processing', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const statusStyle = {
  processing:      'badge-orange',
  confirmed:       'badge-blue',
  preparing:       'badge-blue',
  out_for_delivery:'badge-blue',
  delivered:       'badge-green',
  cancelled:       'badge-red',
};

const AdminOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    adminGetOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const updated = await adminUpdateOrder(orderId, { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o));
      toast.success(`Order updated to "${newStatus.replace('_', ' ')}"!`);
    } catch {
      toast.error('Update failed.');
    } finally { setUpdating(null); }
  };

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-brand-400 text-sm font-medium mb-1">Admin Panel</p>
          <h1 className="section-title text-3xl">Order Management</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="text-white font-semibold text-xl">No orders yet</h3>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-border">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4">Order ID</th>
                    <th className="text-left px-6 py-4">Customer</th>
                    <th className="text-left px-6 py-4">Items</th>
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Total</th>
                    <th className="text-left px-6 py-4">Payment</th>
                    <th className="text-left px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {orders.map((order, i) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-surface-elevated/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                        <p className="text-gray-600 text-xs">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {format(new Date(order.createdAt), 'MMM d, yyyy p')}
                      </td>
                      <td className="px-6 py-4 text-brand-400 font-semibold">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {order.paymentStatus === 'paid'
                          ? <span className="badge-green">Paid</span>
                          : <span className="badge-orange">Pending</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="bg-surface-elevated border border-surface-border text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;

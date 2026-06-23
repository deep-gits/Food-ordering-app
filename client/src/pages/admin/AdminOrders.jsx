import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminGetOrders, adminUpdateOrder } from '../../services/adminService';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, MapPin, CreditCard, Package } from 'lucide-react';

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
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null); // order _id that is expanded

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

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

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
                    <th className="text-left px-6 py-4 w-8"></th>
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
                    <>
                      {/* ── Main Row ── */}
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => toggleExpand(order._id)}
                        className="hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-4 text-gray-500">
                          {expanded === order._id
                            ? <ChevronUp size={16} />
                            : <ChevronDown size={16} />}
                        </td>

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
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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

                      {/* ── Expanded Detail Row ── */}
                      <AnimatePresence>
                        {expanded === order._id && (
                          <motion.tr
                            key={`${order._id}-detail`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan={8} className="px-0 py-0">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-surface-elevated/40 border-t border-surface-border px-8 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">

                                  {/* Ordered Items */}
                                  <div className="lg:col-span-2">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Package size={15} className="text-brand-400" />
                                      <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Ordered Items</p>
                                    </div>
                                    <div className="space-y-2">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-surface-bg/60 rounded-xl px-4 py-2.5 border border-surface-border">
                                          <div className="flex items-center gap-3">
                                            {item.image && (
                                              <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                              />
                                            )}
                                            <div>
                                              <p className="text-white font-medium text-sm">{item.name}</p>
                                              <p className="text-gray-500 text-xs">₹{item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                          </div>
                                          <p className="text-brand-400 font-semibold text-sm">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="mt-3 rounded-xl border border-surface-border px-4 py-3 space-y-1.5 text-xs text-gray-500">
                                      <div className="flex justify-between"><span>Items subtotal</span><span className="text-gray-300">₹{order.itemsPrice?.toFixed(2)}</span></div>
                                      <div className="flex justify-between"><span>Tax</span><span className="text-gray-300">₹{order.taxPrice?.toFixed(2)}</span></div>
                                      <div className="flex justify-between"><span>Delivery fee</span><span className="text-gray-300">₹{order.deliveryFee?.toFixed(2)}</span></div>
                                      <div className="flex justify-between border-t border-surface-border pt-1.5 font-semibold text-white text-sm">
                                        <span>Total</span><span className="text-brand-400">₹{order.totalPrice?.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Delivery & Payment Info */}
                                  <div className="space-y-4">
                                    {/* Delivery Address */}
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={15} className="text-emerald-400" />
                                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Delivery Address</p>
                                      </div>
                                      <div className="bg-surface-bg/60 rounded-xl border border-surface-border p-3 text-xs text-gray-400 space-y-0.5">
                                        <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                                        <p>{order.shippingAddress?.street}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                                        <p>{order.shippingAddress?.country}</p>
                                        <p className="text-gray-500 pt-1">📞 {order.shippingAddress?.phone}</p>
                                      </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <CreditCard size={15} className="text-purple-400" />
                                        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Payment</p>
                                      </div>
                                      <div className="bg-surface-bg/60 rounded-xl border border-surface-border p-3 text-xs space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Method</span>
                                          <span className="text-white font-medium capitalize">
                                            {order.paymentMethod === 'cash_on_delivery' ? '💵 Cash on Delivery' : '💳 Stripe'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Status</span>
                                          {order.paymentStatus === 'paid'
                                            ? <span className="badge-green">Paid</span>
                                            : <span className="badge-orange">Pending</span>}
                                        </div>
                                        {order.notes && (
                                          <div className="pt-1 border-t border-surface-border">
                                            <p className="text-gray-500">Notes:</p>
                                            <p className="text-gray-300 italic">{order.notes}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
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

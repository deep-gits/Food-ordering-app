import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';
import { format } from 'date-fns';

const statusStyle = {
  processing:      'badge-orange',
  confirmed:       'badge-blue',
  preparing:       'badge-blue',
  out_for_delivery:'badge-blue',
  delivered:       'badge-green',
  cancelled:       'badge-red',
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.order);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="section-title text-3xl">My Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {loading ? (
          <Loader text="Loading your orders..." />
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-white font-semibold text-xl mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start browsing and place your first order!</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/order-confirmation/${order._id}`} className="card-hover block p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-brand-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            <Clock size={11} className="inline mr-1" />
                            {format(new Date(order.createdAt), 'PPP')}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2">
                        <span className={statusStyle[order.orderStatus] || 'badge-gray'}>
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                        <p className="font-bold text-brand-400 text-base">₹{order.totalPrice.toFixed(2)}</p>
                        <ChevronRight size={16} className="text-gray-600 hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from 'lucide-react';
import { fetchOrderById } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';
import { format } from 'date-fns';

const STATUS_STEPS = ['processing', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const OrderConfirmation = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading || !order) return <Loader text="Loading your order..." />;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-2">Order Placed!</h1>
          <p className="text-gray-400">
            Order <span className="text-brand-400 font-mono">#{order._id.slice(-8).toUpperCase()}</span> has been received.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Placed on {format(new Date(order.createdAt), 'PPP p')}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Package size={18} className="text-brand-400" />
            <h2 className="font-semibold text-white">Order Status</h2>
          </div>
          <div className="flex items-center justify-between relative">
            {/* Track line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-surface-border z-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-brand-500"
              />
            </div>
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= currentStep;
              const current = i === currentStep;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    done ? 'bg-brand-500 border-brand-500' : 'bg-surface border-surface-border'
                  } ${current ? 'shadow-glow' : ''}`}>
                    {done && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className={`text-[10px] font-medium capitalize hidden sm:block ${done ? 'text-brand-400' : 'text-gray-600'}`}>
                    {step.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{item.name} <span className="text-gray-600">× {item.quantity}</span></span>
                <span className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery</span><span>₹{order.deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-surface-border">
              <span>Total Paid</span>
              <span className="text-brand-400">₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping + Payment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Delivering To</h3>
            </div>
            <p className="text-gray-400 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress.street}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress.country}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Payment</h3>
            </div>
            <p className="text-gray-400 text-sm capitalize">{order.paymentMethod.replace('_', ' ')}</p>
            <p className="mt-2">
              {order.paymentStatus === 'paid'
                ? <span className="badge-green">✓ Paid</span>
                : <span className="badge-orange">⏳ Pending</span>
              }
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-secondary justify-center">
            View All Orders
          </Link>
          <Link to="/menu" className="btn-primary justify-center">
            Order More <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;

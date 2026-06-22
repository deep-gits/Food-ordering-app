import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  street:   z.string().min(5, 'Street address required'),
  city:     z.string().min(2, 'City required'),
  zip:      z.string().min(4, 'ZIP code required'),
  country:  z.string().min(2, 'Country required'),
  phone:    z.string().min(7, 'Phone number required'),
  paymentMethod: z.enum(['stripe', 'cash_on_delivery']),
});

const TAX_RATE = 0.08;
const DELIVERY = 2.99;

const Checkout = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartSubtotal);
  const { loading } = useSelector((s) => s.order);
  const { user }  = useSelector((s) => s.auth);

  const [payMethod, setPayMethod] = useState('stripe');

  const tax   = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName:      user?.name || '',
      street:        user?.address?.street || '',
      city:          user?.address?.city   || '',
      zip:           user?.address?.zip    || '',
      country:       user?.address?.country|| 'India',
      phone:         user?.phone || '',
      paymentMethod: 'stripe',
    },
  });

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    try {
      const orderData = {
        items: items.map((i) => ({
          menuItem: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName, street: data.street, city: data.city,
          zip: data.zip, country: data.country, phone: data.phone,
        },
        paymentMethod:  data.paymentMethod,
        itemsPrice:     subtotal,
        taxPrice:       tax,
        deliveryFee:    DELIVERY,
        totalPrice:     total,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      // Simulate payment
      if (data.paymentMethod === 'stripe') {
        await new Promise((r) => setTimeout(r, 1200)); // simulate processing
      }

      dispatch(clearCart());
      navigate(`/order-confirmation/${result._id}`);
    } catch (err) {
      toast.error(err || 'Checkout failed. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🛒</p>
          <h2 className="text-white font-display font-bold text-2xl">Cart is empty</h2>
          <p className="text-gray-500">Add some items before checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-3xl mb-10">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left — Shipping + Payment */}
            <div className="lg:col-span-3 space-y-6">

              {/* Shipping Address */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={18} className="text-brand-400" />
                  <h2 className="font-semibold text-white text-lg">Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Full Name</label>
                    <input id="fullName" {...register('fullName')} className={`input ${errors.fullName ? 'input-error' : ''}`} placeholder="John Doe" />
                    {errors.fullName && <p className="error-msg">{errors.fullName.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Street Address</label>
                    <input id="street" {...register('street')} className={`input ${errors.street ? 'input-error' : ''}`} placeholder="123 Main Street" />
                    {errors.street && <p className="error-msg">{errors.street.message}</p>}
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input id="city" {...register('city')} className={`input ${errors.city ? 'input-error' : ''}`} placeholder="Mumbai" />
                    {errors.city && <p className="error-msg">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="label">ZIP Code</label>
                    <input id="zip" {...register('zip')} className={`input ${errors.zip ? 'input-error' : ''}`} placeholder="400001" />
                    {errors.zip && <p className="error-msg">{errors.zip.message}</p>}
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input id="country" {...register('country')} className={`input ${errors.country ? 'input-error' : ''}`} placeholder="India" />
                    {errors.country && <p className="error-msg">{errors.country.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input id="phone" {...register('phone')} className={`input ${errors.phone ? 'input-error' : ''}`} placeholder="+91 98765 43210" />
                    {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} className="text-brand-400" />
                  <h2 className="font-semibold text-white text-lg">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'stripe',           label: '💳 Card / Stripe',     desc: 'Simulated secure payment' },
                    { value: 'cash_on_delivery', label: '💵 Cash on Delivery',  desc: 'Pay when you receive' },
                  ].map((m) => (
                    <label
                      key={m.value}
                      htmlFor={`pay-${m.value}`}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        payMethod === m.value
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-surface-border hover:border-brand-500/40'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`pay-${m.value}`}
                        value={m.value}
                        {...register('paymentMethod')}
                        onChange={() => setPayMethod(m.value)}
                        className="mt-0.5 accent-orange-500"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{m.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {payMethod === 'stripe' && (
                  <div className="mt-4 p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-3">
                    <p className="text-xs text-gray-500 font-medium">CARD DETAILS (Simulated)</p>
                    <input className="input" placeholder="4242 4242 4242 4242" disabled defaultValue="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input" placeholder="MM/YY" disabled defaultValue="12/26" />
                      <input className="input" placeholder="CVC" disabled defaultValue="123" />
                    </div>
                    <p className="text-[11px] text-gray-600">🔒 This is a simulated payment. No real charges made.</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right — Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 space-y-4 lg:sticky lg:top-20 h-fit">
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingBag size={18} className="text-brand-400" />
                  <h2 className="font-semibold text-white text-lg">Order Summary</h2>
                </div>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between gap-2 text-sm">
                      <span className="text-gray-400 truncate">{item.name} × {item.quantity}</span>
                      <span className="text-white font-medium flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1"><Truck size={12} /> Delivery</span>
                    <span>₹{DELIVERY.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-surface-border">
                    <span>Total</span>
                    <span className="text-brand-400">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                id="place-order-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base py-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>Place Order — ₹{total.toFixed(2)}</>
                )}
              </button>

              <p className="text-center text-gray-600 text-xs">
                🔒 Secure checkout. Your data is protected.
              </p>
            </motion.div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

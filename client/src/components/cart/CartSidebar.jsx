import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import {
  selectCartItems, selectCartIsOpen, selectCartSubtotal, selectCartCount,
  closeCart, clearCart,
} from '../../store/slices/cartSlice';
import CartItem from './CartItem';

const TAX_RATE   = 0.08;
const DELIVERY   = 2.99;

const CartSidebar = () => {
  const dispatch  = useDispatch();
  const items     = useSelector(selectCartItems);
  const isOpen    = useSelector(selectCartIsOpen);
  const subtotal  = useSelector(selectCartSubtotal);
  const count     = useSelector(selectCartCount);

  const tax   = subtotal * TAX_RATE;
  const total = subtotal + tax + (subtotal > 0 ? DELIVERY : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-card border-l border-surface-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-400" />
                <h2 className="font-display font-bold text-white text-lg">
                  Cart <span className="text-brand-400">({count})</span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="btn-danger text-xs px-3 py-1.5"
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                )}
                <button
                  id="close-cart-btn"
                  onClick={() => dispatch(closeCart())}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-surface-elevated transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-16"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-surface-elevated flex items-center justify-center text-4xl">
                      🛒
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">Your cart is empty</p>
                      <p className="text-gray-500 text-sm mt-1">Add some delicious items!</p>
                    </div>
                    <Link
                      to="/menu"
                      onClick={() => dispatch(closeCart())}
                      className="btn-primary text-sm"
                    >
                      Browse Menu
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => <CartItem key={item._id} item={item} />)
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-surface-border p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span><span>₹{DELIVERY.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-surface-border">
                    <span>Total</span>
                    <span className="text-brand-400">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  id="checkout-btn"
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full justify-center text-base"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

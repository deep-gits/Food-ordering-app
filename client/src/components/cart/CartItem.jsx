import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { motion } from 'framer-motion';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=60';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-surface-border"
    >
      {/* Image */}
      <img
        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : PLACEHOLDER}
        alt={item.name}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.name}</p>
        <p className="text-brand-400 text-sm font-semibold mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-gray-600 text-xs">₹{item.price.toFixed(2)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
          className="w-7 h-7 rounded-lg bg-surface-border hover:bg-surface text-gray-400 hover:text-white flex items-center justify-center transition-all"
          aria-label="Decrease quantity"
        >
          {item.quantity === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} />}
        </button>
        <span className="w-6 text-center text-white text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
          className="w-7 h-7 rounded-lg bg-surface-border hover:bg-brand-500/20 text-gray-400 hover:text-brand-400 flex items-center justify-center transition-all"
          aria-label="Increase quantity"
        >
          <Plus size={13} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;

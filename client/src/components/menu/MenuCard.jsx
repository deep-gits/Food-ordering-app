import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Tag } from 'lucide-react';
import { addToCart, openCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80';

const MenuCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    dispatch(openCart());
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: { background: '#1a1a1f', color: '#fff', border: '1px solid #2e2e36' },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="card-hover flex flex-col overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-surface-elevated">
        <img
          src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : PLACEHOLDER}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Featured badge */}
        {item.isFeatured && (
          <span className="absolute top-3 left-3 badge bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider">
            ⭐ Featured
          </span>
        )}

        {/* Category badge */}
        {item.category?.name && (
          <span className="absolute top-3 right-3 badge badge-orange text-[10px]">
            {item.category.icon} {item.category.name}
          </span>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="badge badge-red text-sm font-semibold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-elevated text-gray-500 text-[10px]">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display font-bold text-xl text-brand-400">₹{item.price.toFixed(2)}</span>
            {item.preparationTime && (
              <div className="flex items-center gap-1 text-gray-600 text-xs mt-0.5">
                <Clock size={10} /> {item.preparationTime} min
              </div>
            )}
          </div>
          <button
            id={`add-to-cart-${item._id}`}
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="btn-primary px-4 py-2 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;

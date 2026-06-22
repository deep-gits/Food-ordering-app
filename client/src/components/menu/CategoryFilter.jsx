import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, onChange }) => {
  const all = { _id: 'all', name: 'All', icon: '🍽️' };
  const items = [all, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {items.map((cat) => {
        const isActive = activeCategory === cat._id;
        return (
          <motion.button
            key={cat._id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(cat._id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-brand-500 text-white shadow-glow'
                : 'bg-surface-elevated border border-surface-border text-gray-400 hover:text-white hover:border-brand-500/30'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} rounded-full border-2 border-surface-border border-t-brand-500`}
      />
      {text && <p className="text-gray-500 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-glow-lg"
      >
        <ChefHat size={32} className="text-white" />
      </motion.div>
      <p className="text-gray-400 text-sm font-medium animate-pulse">Loading FeastFlow...</p>
    </div>
  </div>
);

export default Loader;

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Star } from 'lucide-react';
import { fetchFeaturedItems, fetchCategories } from '../store/slices/menuSlice';
import MenuCard from '../components/menu/MenuCard';
import Loader from '../components/common/Loader';

const features = [
  { icon: Zap,    title: 'Lightning Fast',   desc: 'Delivery in 30 mins or less, guaranteed.' },
  { icon: Shield, title: '100% Fresh',        desc: 'Only the freshest ingredients, every order.' },
  { icon: Clock,  title: 'Track Live',        desc: 'Real-time order tracking from kitchen to door.' },
  { icon: Star,   title: 'Top Rated',         desc: 'Loved by over 50,000 happy customers.' },
];

const Home = () => {
  const dispatch = useDispatch();
  const { featured, categories, loading } = useSelector((s) => s.menu);

  useEffect(() => {
    dispatch(fetchFeaturedItems());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="animate-fade-in">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* BG gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%]  w-[400px] h-[400px] rounded-full bg-orange-700/8  blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                Now delivering in your area
              </div>

              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight">
                Hungry?{' '}
                <span className="text-gradient block">We've Got</span>
                You Covered.
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Discover amazing food from top restaurants near you. Order in seconds, track in real-time, and enjoy fresh meals delivered to your door.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="btn-primary text-base px-8 py-4">
                  Order Now <ArrowRight size={18} />
                </Link>
                <Link to="/menu" className="btn-secondary text-base px-8 py-4">
                  Explore Menu
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {[['50K+', 'Happy Customers'], ['200+', 'Menu Items'], ['30 min', 'Avg Delivery']].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-display font-bold text-2xl text-white">{num}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-[420px] h-[420px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-pulse-slow" />
                <div className="absolute inset-6 rounded-full border border-brand-500/15" />

                {/* Center image */}
                <div className="absolute inset-10 rounded-full overflow-hidden shadow-glow-lg border-2 border-brand-500/30">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=85"
                    alt="Delicious food"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 glass px-4 py-3 shadow-card"
                >
                  <p className="text-xs text-gray-400">Estimated delivery</p>
                  <p className="font-bold text-white">28 minutes 🚀</p>
                </motion.div>

                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 glass px-4 py-3 shadow-card"
                >
                  <p className="text-xs text-gray-400">Today's special</p>
                  <p className="font-bold text-brand-400">Pepperoni Feast 🍕</p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 space-y-3 hover:border-brand-500/30 transition-colors duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-brand-400 text-sm font-medium mb-2">What are you craving?</p>
                <h2 className="section-title">Browse Categories</h2>
              </div>
              <Link to="/menu" className="btn-ghost text-brand-400 hover:text-brand-300">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/menu?category=${cat._id}`}
                    className="card-hover flex flex-col items-center gap-2 p-5 text-center"
                  >
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-white">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Items ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-400 text-sm font-medium mb-2">Hand-picked for you</p>
              <h2 className="section-title">Featured Dishes</h2>
            </div>
            <Link to="/menu" className="btn-ghost text-brand-400 hover:text-brand-300">
              Full Menu <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-center shadow-glow-lg"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=60')] opacity-10 bg-cover bg-center" />
            <div className="relative z-10">
              <h2 className="font-display font-extrabold text-4xl text-white mb-4">
                First Order? Get 20% Off! 🎉
              </h2>
              <p className="text-brand-100 text-lg mb-8 max-w-md mx-auto">
                Use code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">FIRST20</span> at checkout.
              </p>
              <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-lg text-base">
                Claim Offer <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

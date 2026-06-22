import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  fetchMenuItems, fetchCategories,
  setActiveCategory, setSearchQuery, setSortBy,
} from '../store/slices/menuSlice';
import MenuCard from '../components/menu/MenuCard';
import CategoryFilter from '../components/menu/CategoryFilter';
import Loader from '../components/common/Loader';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Latest'      },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name',       label: 'A–Z'          },
];

const Menu = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, categories, loading, activeCategory, searchQuery, sortBy } = useSelector((s) => s.menu);
  const [localSearch, setLocalSearch] = useState('');

  // Sync URL category param on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) dispatch(setActiveCategory(cat));
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    const params = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (searchQuery) params.search = searchQuery;
    if (sortBy !== 'default') params.sort = sortBy;
    dispatch(fetchMenuItems(params));
  }, [dispatch, activeCategory, searchQuery, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearchQuery(localSearch)), 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-medium mb-2">Explore our kitchen</p>
          <h1 className="section-title text-4xl">Our Menu</h1>
          <p className="text-gray-500 mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="menu-search"
              type="text"
              placeholder="Search for dishes..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative sm:w-52">
            <SlidersHorizontal size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              id="menu-sort"
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="input pl-10 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={(id) => dispatch(setActiveCategory(id))}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <Loader text="Loading dishes..." />
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🍽️</p>
            <h3 className="text-white font-semibold text-xl mb-2">No dishes found</h3>
            <p className="text-gray-500">Try a different search or category.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Menu;

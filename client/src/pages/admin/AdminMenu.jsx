import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Image } from 'lucide-react';
import { adminGetMenuItems, adminCreateItem, adminUpdateItem, adminDeleteItem } from '../../services/adminService';
import * as menuService from '../../services/menuService';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=60';

const emptyForm = { name: '', description: '', price: '', category: '', isAvailable: true, isFeatured: false, preparationTime: 20, tags: '' };

const AdminMenu = () => {
  const [items,      setItems]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [imageFile,  setImageFile]  = useState(null);
  const [saving,     setSaving]     = useState(false);

  const load = async () => {
    try {
      const [i, c] = await Promise.all([adminGetMenuItems(), menuService.getCategories()]);
      setItems(i); setCategories(c);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setImageFile(null); setShowModal(true); };
  const openEdit   = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, description: item.description, price: item.price,
      category: item.category?._id || item.category,
      isAvailable: item.isAvailable, isFeatured: item.isFeatured,
      preparationTime: item.preparationTime, tags: item.tags?.join(', ') || '',
    });
    setImageFile(null); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        const updated = await adminUpdateItem(editItem._id, fd);
        setItems((p) => p.map((i) => i._id === editItem._id ? updated : i));
        toast.success('Item updated!');
      } else {
        const created = await adminCreateItem(fd);
        setItems((p) => [created, ...p]);
        toast.success('Item created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await adminDeleteItem(id);
      setItems((p) => p.filter((i) => i._id !== id));
      toast.success('Item deleted.');
    } catch { toast.error('Delete failed.'); }
  };

  if (loading) return <Loader text="Loading menu..." />;

  return (
    <div className="min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">Admin Panel</p>
            <h1 className="section-title text-3xl">Menu Management</h1>
            <p className="text-gray-500 mt-1">{items.length} items</p>
          </div>
          <button id="add-menu-item-btn" onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-border">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Item</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Featured</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : PLACEHOLDER}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => { e.target.src = PLACEHOLDER; }}
                        />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-600 text-xs truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.category?.icon} {item.category?.name}</td>
                    <td className="px-6 py-4 text-brand-400 font-semibold">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {item.isAvailable ? <span className="badge-green">Available</span> : <span className="badge-red">Unavailable</span>}
                    </td>
                    <td className="px-6 py-4">
                      {item.isFeatured ? <span className="badge-orange">⭐ Yes</span> : <span className="badge-gray">No</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="btn-ghost p-2" aria-label="Edit">
                          <Pencil size={15} className="text-blue-400" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="btn-ghost p-2" aria-label="Delete">
                          <Trash2 size={15} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-surface-border sticky top-0 bg-surface-card z-10">
                  <h2 className="font-semibold text-white text-lg">
                    {editItem ? 'Edit Menu Item' : 'New Menu Item'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="btn-ghost p-2"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="label">Name</label>
                    <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Margherita Pizza" />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..." />
                  </div>
                  {/* Price + Category row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Price (₹)</label>
                      <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="12.99" />
                    </div>
                    <div>
                      <label className="label">Category</label>
                      <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <option value="">Select...</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Prep time + Tags */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Prep Time (min)</label>
                      <input type="number" className="input" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Tags (comma separated)</label>
                      <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="spicy, vegan" />
                    </div>
                  </div>
                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                      <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-orange-500" />
                      Available
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-orange-500" />
                      Featured
                    </label>
                  </div>
                  {/* Image */}
                  <div>
                    <label className="label">Image</label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-surface-border hover:border-brand-500/50 cursor-pointer transition-all">
                      <Image size={20} className="text-gray-500" />
                      <span className="text-gray-500 text-sm">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-surface-border">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button id="save-menu-item-btn" onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                    <Check size={15} /> {saving ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenu;

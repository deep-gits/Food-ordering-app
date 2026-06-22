import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Package, Save } from 'lucide-react';
import { updateProfile } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('profile');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name:     user?.name    || '',
      phone:    user?.phone   || '',
      street:   user?.address?.street  || '',
      city:     user?.address?.city    || '',
      zip:      user?.address?.zip     || '',
      country:  user?.address?.country || '',
    },
  });

  const onSave = async (data) => {
    try {
      await dispatch(updateProfile({
        name:  data.name,
        phone: data.phone,
        address: { street: data.street, city: data.city, zip: data.zip, country: data.country },
      })).unwrap();
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <User size={28} className="text-brand-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email} · <span className="capitalize text-brand-400">{user?.role}</span></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-surface-elevated border border-surface-border rounded-xl p-1 w-fit">
          {[
            { id: 'profile', label: 'Profile',  Icon: User    },
            { id: 'orders',  label: 'Orders',   Icon: Package },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === id ? 'bg-brand-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSubmit(onSave)} className="space-y-6">

              <div className="card p-6">
                <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <User size={16} className="text-brand-400" /> Personal Info
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input id="profile-name" {...register('name')} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input value={user?.email} disabled className="input pl-10 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input id="profile-phone" {...register('phone')} placeholder="+91 98765 43210" className="input pl-10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <MapPin size={16} className="text-brand-400" /> Default Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Street</label>
                    <input id="profile-street" {...register('street')} placeholder="123 Main Street" className="input" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input id="profile-city" {...register('city')} className="input" />
                  </div>
                  <div>
                    <label className="label">ZIP Code</label>
                    <input id="profile-zip" {...register('zip')} className="input" />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input id="profile-country" {...register('country')} className="input" />
                  </div>
                </div>
              </div>

              <button id="save-profile-btn" type="submit" disabled={loading} className="btn-primary px-8 py-3">
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Orders shortcut */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Package size={48} className="text-brand-400 mx-auto mb-4 opacity-60" />
            <h3 className="text-white font-semibold text-xl mb-2">Your Orders</h3>
            <p className="text-gray-500 mb-6">View all your past and current orders.</p>
            <Link to="/orders" className="btn-primary">View Order History</Link>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Profile;

import { Link } from 'react-router-dom';
import { ChefHat, GitFork, Globe, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-surface-border bg-surface-card mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
              <ChefHat size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Feast<span className="text-gradient">Flow</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Delicious food delivered to your doorstep. Fresh ingredients, bold flavors, and lightning-fast delivery.
          </p>
          <div className="flex items-center gap-3">
            {[GitFork, Globe, Heart].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center text-gray-500 hover:text-brand-400 hover:border-brand-500/40 transition-all duration-200">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {[
              { to: '/',          label: 'Home'        },
              { to: '/menu',      label: 'Our Menu'    },
              { to: '/orders',    label: 'My Orders'   },
              { to: '/profile',   label: 'Profile'     },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-gray-500 hover:text-brand-400 text-sm transition-colors duration-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Info</h4>
          <ul className="space-y-2.5 text-gray-500 text-sm">
            <li>📍 123 Food Street, Mumbai</li>
            <li>📞 +91 8630716277</li>
            <li>✉️ deepaksaraswat8913@gmail.com</li>
            <li className="pt-1">
              <span className="badge-green">Open Now</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="divider mt-8 mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-xs">
        <p>© {new Date().getFullYear()} FeastFlow. All rights reserved.</p>
        <p>Built with ❤️ using MERN Stack</p>
      </div>
    </div>
  </footer>
);

export default Footer;

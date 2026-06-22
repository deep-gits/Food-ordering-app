import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartSidebar from './components/cart/CartSidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home             from './pages/Home';
import Menu             from './pages/Menu';
import Checkout         from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory     from './pages/OrderHistory';
import Profile          from './pages/Profile';
import Login            from './pages/auth/Login';
import Register         from './pages/auth/Register';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminMenu        from './pages/admin/AdminMenu';
import AdminOrders      from './pages/admin/AdminOrders';

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CartSidebar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/"        element={<Home />}     />
            <Route path="/menu"    element={<Menu />}     />
            <Route path="/login"   element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* Protected — authenticated users */}
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/order-confirmation/:id" element={
              <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrderHistory /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/menu" element={
              <ProtectedRoute adminOnly><AdminMenu /></ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                  <p className="text-8xl mb-4">🍕</p>
                  <h1 className="font-display font-bold text-4xl text-white mb-2">404 — Page Not Found</h1>
                  <p className="text-gray-500">Looks like this page got eaten!</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#1a1a1f', color: '#fff', border: '1px solid #2e2e36' },
        }}
      />
    </Router>
  </Provider>
);

export default App;

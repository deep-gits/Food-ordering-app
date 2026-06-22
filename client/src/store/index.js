import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serialized = localStorage.getItem('cart');
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

// Persist cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  } catch {
    // ignore
  }
};

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? { auth: { user: JSON.parse(user), loading: false, error: null } } : undefined;
  } catch {
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    auth:  authReducer,
    cart:  cartReducer,
    menu:  menuReducer,
    order: orderReducer,
  },
  preloadedState: {
    ...loadUserFromStorage(),
    cart: loadCartFromStorage(),
  },
});

// Subscribe to persist cart state
store.subscribe(() => {
  saveCartToStorage(store.getState());
});

export default store;

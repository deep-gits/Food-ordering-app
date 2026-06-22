import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../../services/orderService';

export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(orderData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed');
  }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await orderService.getMyOrders();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await orderService.getOrderById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order not found');
  }
});

export const payOrder = createAsyncThunk('order/pay', async ({ id, paymentData }, { rejectWithValue }) => {
  try {
    return await orderService.payOrder(id, paymentData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment failed');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders:       [],
    currentOrder: null,
    loading:      false,
    success:      false,
    error:        null,
  },
  reducers: {
    resetOrderState(state) {
      state.success = false;
      state.error = null;
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true; state.error = null; state.success = false; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(createOrder.pending,   pending)
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.success = true; state.currentOrder = action.payload; })
      .addCase(createOrder.rejected,  rejected)

      .addCase(fetchMyOrders.pending,   pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected,  rejected)

      .addCase(fetchOrderById.pending,   pending)
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(fetchOrderById.rejected,  rejected)

      .addCase(payOrder.pending,   pending)
      .addCase(payOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(payOrder.rejected,  rejected);
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;

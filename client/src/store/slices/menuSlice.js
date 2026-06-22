import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as menuService from '../../services/menuService';

export const fetchMenuItems = createAsyncThunk('menu/fetchItems', async (params, { rejectWithValue }) => {
  try {
    return await menuService.getMenuItems(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load menu');
  }
});

export const fetchCategories = createAsyncThunk('menu/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await menuService.getCategories();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load categories');
  }
});

export const fetchFeaturedItems = createAsyncThunk('menu/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    return await menuService.getFeaturedItems();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load featured items');
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items:      [],
    featured:   [],
    categories: [],
    loading:    false,
    error:      null,
    activeCategory: 'all',
    searchQuery:    '',
    sortBy:         'default',
  },
  reducers: {
    setActiveCategory(state, action) { state.activeCategory = action.payload; },
    setSearchQuery(state, action)    { state.searchQuery = action.payload; },
    setSortBy(state, action)         { state.sortBy = action.payload; },
    clearMenuError(state)            { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMenuItems.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMenuItems.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })

      .addCase(fetchFeaturedItems.fulfilled, (state, action) => { state.featured = action.payload; });
  },
});

export const { setActiveCategory, setSearchQuery, setSortBy, clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;

import { supabase } from "@/lib/supabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Shop = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  athour: string;
  supervisor_id: string;
  location: string;
};

export type Item = {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  description: string;
  created_at: string;
};

type ShopState = {
  shops: Shop[];
  items: Item[];
  status: "idle" | "loading" | "succeeded" | "failed";
  itemsStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentShop: Shop | null;
};

const initialState: ShopState = {
  shops: [],
  items: [],
  status: "idle",
  itemsStatus: "idle",
  error: null,
  currentShop: null,
};

export const fetchShopsThunk = createAsyncThunk(
  "shops/fetchShops",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("athour", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      return data as Shop[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createShopThunk = createAsyncThunk(
  "shops/createShop",
  async (
    shopData: Omit<Shop, "id" | "created_at" | "updated_at">,
    { rejectWithValue },
  ) => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .insert([shopData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as Shop;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateShopThunk = createAsyncThunk(
  "shops/updateShop",
  async (
    { id, updates }: { id: string; updates: Partial<Shop> },
    { rejectWithValue },
  ) => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as Shop;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchShopItemsThunk = createAsyncThunk(
  "shops/fetchShopItems",
  async (shopId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("shop_id", shopId);

      if (error) {
        throw error;
      }
      return data as Item[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addShopItemThunk = createAsyncThunk(
  "shops/addShopItem",
  async (itemData: Omit<Item, "id" | "created_at">, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .insert([itemData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as Item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const shopSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setCurrentShop(state, action: PayloadAction<Shop | null>) {
      state.currentShop = action.payload;
    },
    clearShopError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shops
      .addCase(fetchShopsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShopsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shops = action.payload;
      })
      .addCase(fetchShopsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create Shop
      .addCase(createShopThunk.fulfilled, (state, action) => {
        state.shops.unshift(action.payload);
      })
      // Update Shop
      .addCase(updateShopThunk.fulfilled, (state, action) => {
        const index = state.shops.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
        if (state.currentShop?.id === action.payload.id) {
          state.currentShop = action.payload;
        }
      })
      // Fetch Shop Items
      .addCase(fetchShopItemsThunk.pending, (state) => {
        state.itemsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchShopItemsThunk.fulfilled, (state, action) => {
        state.itemsStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchShopItemsThunk.rejected, (state, action) => {
        state.itemsStatus = "failed";
        state.error = action.payload as string;
      })
      // Add Shop Item
      .addCase(addShopItemThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setCurrentShop, clearShopError } = shopSlice.actions;
export default shopSlice.reducer;

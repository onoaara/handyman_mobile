import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import shopReducer from "./shopSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shops: shopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

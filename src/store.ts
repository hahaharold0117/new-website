import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Authentication } from "./auth";
import toastReducer from "@/toastSlice";
import uploadSlice from "@/uploadSlice";
import { api } from "@/api";

const authSlice = createSlice({
  name: "auth",
  initialState: null as Authentication | null,
  reducers: {
    setAuth: (
      state,
      { payload: { auth } }: PayloadAction<{ auth: Authentication | null }>,
    ) => {
      state = auth;
      return state;
    },
  },
});

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer,
    toast: toastReducer,
    upload: uploadSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export const { setAuth } = authSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const TOAST_LIMIT = 1;

type ToasterToast = {
  id: string;
  // title?: React.ReactNode;
  title: string;
  // description?: React.ReactNode;
  description?: string;
  // action?: ToastActionElement;
  variant?: "destructive" | "default";
};

interface State {
  toasts: ToasterToast[];
}

const initialState: State = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToasterToast>) => {
      state.toasts.unshift(action.payload);
      state.toasts = state.toasts.slice(0, TOAST_LIMIT);
    },
    updateToast: (state, action: PayloadAction<Partial<ToasterToast>>) => {
      const index = state.toasts.findIndex(
        (toast) => toast.id === action.payload.id,
      );
      if (index !== -1) {
        state.toasts[index] = { ...state.toasts[index], ...action.payload };
      }
    },
    dismissToast: (state, action: PayloadAction<string | undefined>) => {
      state.toasts = state.toasts.map((toast) =>
        toast.id === action.payload || action.payload === undefined
          ? { ...toast, open: false }
          : toast,
      );
    },
    removeToast: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload === undefined) {
        state.toasts = [];
      } else {
        state.toasts = state.toasts.filter(
          (toast) => toast.id !== action.payload,
        );
      }
    },
  },
});

export const { addToast, updateToast, dismissToast, removeToast } =
  toastSlice.actions;
export default toastSlice.reducer;

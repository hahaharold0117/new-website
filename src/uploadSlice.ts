import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Status = "pending" | "started" | "finished" | "failed";

interface Upload {
  id: string;
  name: string;
  progress: number;
  status: Status;
}

const initialState: { files: Upload[] } = {
  files: [],
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<Upload>) => {
      const index = state.files.findIndex(
        (file) => file.id == action.payload.id,
      );
      if (index >= 0) {
        state.files[index] = { ...state.files[index], ...action.payload };
      }
    },
    startUpload: (
      state,
      action: PayloadAction<Pick<Upload, "id" | "name">>,
    ) => {
      state.files.push({ ...action.payload, progress: 0, status: "pending" });
    },
    finishUpload: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((f) => f.id != action.payload);
    },
    removeStoreFiles: (state) => {
      state.files = [];
    },
  },
});

export const { updateStatus, startUpload, finishUpload, removeStoreFiles } = slice.actions;
export default slice;

import { createSlice } from "@reduxjs/toolkit";
import type { Request } from "../types/request";

const requestSlice = createSlice({
  name: "requests",
  initialState: [] as Request[],
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

interface Request {
  _id: string;
}

const requestSlice = createSlice({
  name: "requests",
  initialState: [] as Request[],
  reducers: {
    addRequests: (_state, action) => action.payload,
    removeRequest: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
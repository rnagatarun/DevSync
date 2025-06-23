import { createSlice } from '@reduxjs/toolkit';

interface User {
    _id: string;
    // add other user properties if needed
}

const feedSlice = createSlice({
    name: 'feed',
    initialState: null as User[] | null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {
            if (!state) return state;
            return state.filter((user: User) => user._id !== action.payload);
        },
    }
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
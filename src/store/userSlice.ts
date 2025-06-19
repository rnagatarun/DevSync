import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    _id?: string;
    firstName?: string;
    lastName?: string;
    emailId?: string;
    photoUrl?: string;
    about?: string;
    skills?: string[];
}

const initialState: UserState = {};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            return { ...action.payload };
        },
        removeUser: () => {
            return {};
        }
    }
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
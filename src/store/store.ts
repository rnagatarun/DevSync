import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import feedReducer from './feedSlice.js';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
    }
});

export  type RootState = ReturnType<typeof appStore.getState>;
export default appStore;
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import feedReducer from './feedSlice.js';
import ConnectionsReducer from './connectionsSlice.js';
import requestReducer from './requestSlice.js';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: ConnectionsReducer,
        requests: requestReducer,
    }
});

export  type RootState = ReturnType<typeof appStore.getState>;
export default appStore;
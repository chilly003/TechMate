import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';

const store = configureStore({
    reducer: {
        article: articleReducer,
        memo: memoReducer,
        folder: folderReducer,
        // ... other reducers
    },
});

export default store;
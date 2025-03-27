import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';
import scrapSlice from './slices/scrapSlice';
import { memo } from 'react';


const store = configureStore({
    reducer: {
        article: articleReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        scrap : scrapSlice,
        memo : memoReducer,
        // ... other reducers
    },
});

export default store;

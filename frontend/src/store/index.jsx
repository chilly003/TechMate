import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';
import scrapSlice from './slices/scrapSlice';

const store = configureStore({
    reducer: {
        article: articleReducer,
        memo: memoReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        scrap : scrapSlice,
        // ... other reducers
    },
});

export default store;

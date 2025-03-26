import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';


const store = configureStore({
    reducer: {
        article: articleReducer,
        memo: memoReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        memo: memoReducer
        // ... other reducers
    },
});

export default store;

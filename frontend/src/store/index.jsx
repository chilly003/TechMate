import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';
import quizReducer from './slices/quizSlice';
import scrapSlice from './slices/scrapSlice';
import { memo } from 'react';


const store = configureStore({
    reducer: {
        article: articleReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        scrap: scrapSlice,
        memo: memoReducer,
        quiz: quizReducer,
        // ... other reducers
    },
});

export default store;

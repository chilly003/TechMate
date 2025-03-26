import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import userProfileReducer from './slices/userProfileSlice';
import memoReducer from './slices/memoSlice';



const store = configureStore({
    reducer: {
        article: articleReducer,
        userProfile: userProfileReducer,
        memo: memoReducer
        // ... other reducers
    },
});

export default store;

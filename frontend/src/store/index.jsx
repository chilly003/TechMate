import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import userProfileReducer from './slices/userProfileSlice';

const store = configureStore({
    reducer: {
        article: articleReducer,
        userProfile: userProfileReducer,
        // ... other reducers
    },
});

export default store;

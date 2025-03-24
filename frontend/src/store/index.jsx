import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';

const store = configureStore({
    reducer: {
        article: articleReducer,
        // ... other reducers
    },
});

export default store;

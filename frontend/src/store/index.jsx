import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';
import myPageReducer from './slices/myPageSlice';



const store = configureStore({
    reducer: {
        article: articleReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        memo: memoReducer,
        myPage: myPageReducer
        // ... other reducers
    },
});

export default store;

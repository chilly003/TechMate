import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 랜덤 기사 조회 액션
export const fetchRandomArticles = createAsyncThunk(
    'userProfile/fetchRandomArticles',
    async (nickname, { rejectWithValue }) => {
        try {
            const response = await axios({
                method: 'get',
                url: 'v1/articles/random',
                data: {
                    nickname: nickname
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 선호 기사 등록 액션
export const registerPreferredArticles = createAsyncThunk(
    'userProfile/registerPreferred',
    async (articleIds, { rejectWithValue }) => {
        try {
            const response = await axios.post('v1/articles/preferred', {
                article_id: articleIds
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 초기 상태 정의
const initialState = {
    randomArticles: [], // 랜덤으로 조회된 기사 목록
    loading: false,     // 로딩 상태
    error: null,        // 에러 상태
    setupComplete: false // 프로필 설정 완료 여부
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        // 프로필 설정 상태 초기화
        resetProfileSetup: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            // 랜덤 기사 조회 처리
            .addCase(fetchRandomArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRandomArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.randomArticles = action.payload.data;
            })
            .addCase(fetchRandomArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 선호 기사 등록 처리
            .addCase(registerPreferredArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerPreferredArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.setupComplete = true;
            })
            .addCase(registerPreferredArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetProfileSetup } = userProfileSlice.actions;
export default userProfileSlice.reducer;
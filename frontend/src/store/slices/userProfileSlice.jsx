import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';  

// 랜덤 기사 조회 액션
export const fetchRandomArticles = createAsyncThunk(
    'userProfile/fetchRandomArticles',
    async (nickname, { rejectWithValue }) => {
        try {
            console.log('📝 닉네임 등록 시도:', nickname);
            const response = await api.get('/articles/random', {
                data: { nickname }
            });
            console.log('✅ 닉네임 등록 성공:', response.data);
            return response.data;
        } catch (err) {
            console.error('❌ 닉네임 등록 실패:', err);
            return rejectWithValue(err.response.data);
        }
    }
);

// 선호 기사 등록 액션
export const registerPreferredArticles = createAsyncThunk(
    'userProfile/registerPreferred',
    async (articleIds, { rejectWithValue }) => {
        try {
            console.log('📝 선호 기사 등록 시도:', articleIds);
            const response = await api.post('/articles/random', {
                article_id: articleIds
            });
            console.log('✅ 선호 기사 등록 성공:', response.data);
            return response.data;
        } catch (err) {
            console.error('❌ 선호 기사 등록 실패:', err);
            return rejectWithValue(err.response.data);
        }
    }
);

// 초기 상태 정의
const initialState = {
    randomArticles: [],
    loading: false,
    error: null,
    setupComplete: false,
    nickname: '',
    selectedArticles: [] // 사용자가 선택한 기사 ID 목록
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        resetProfileSetup: (state) => initialState,
        setNickname: (state, action) => {
            state.nickname = action.payload;
        },
        toggleArticleSelection: (state, action) => {
            const articleId = action.payload;
            const index = state.selectedArticles.indexOf(articleId);
            if (index === -1 && state.selectedArticles.length < 3) {
                state.selectedArticles.push(articleId);
            } else if (index !== -1) {
                state.selectedArticles.splice(index, 1);
            }
        }
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
                state.randomArticles = action.payload.data.map(article => ({
                    id: article.articleId,
                    title: article.title,
                    journal: article.journal,
                    summary: article.summary,
                    thumbnailUrl: article.thumbnailImageUrl,
                    datetime: article.datetime,
                    category: article.category
                }));
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
                state.selectedArticles = []; // 선택된 기사 목록 초기화
            })
            .addCase(registerPreferredArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { 
    resetProfileSetup, 
    setNickname, 
    toggleArticleSelection 
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
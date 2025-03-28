import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';  

// 랜덤 기사 조회 액션
export const fetchRandomArticles = createAsyncThunk(
    'userProfile/fetchRandomArticles',
    async (nickname, { rejectWithValue }) => {
        try {
            const response = await api.get('/user-preference/random', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // response 구조 확인을 위한 상세 로깅
            console.log('📝 응답 데이터:', response.data);
            
            const articles = response.data.data;
            
            if (!articles || !Array.isArray(articles)) {
                console.log('❌ 유효하지 않은 데이터:', articles);
                throw new Error('유효하지 않은 기사 데이터 형식');
            }

            const mappedArticles = articles.map(article => ({
                id: article.articleId,
                title: article.title,
                journal: article.journal,
                summary: article.summary,
                thumbnailUrl: article.thumbnailImageUrl,
                datetime: article.datetime,
                category: article.category
            }));
            
            return mappedArticles;

        } catch (err) {
            console.error('❌ 상세 에러 정보:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            return rejectWithValue(err.message);  // 여기서 에러가 발생하면 rejected 상태로 감
        }
    }
);

// 선호 기사 등록 액션
export const registerPreferredArticles = createAsyncThunk(
    'userProfile/registerPreferred',
    async (articleIds, { rejectWithValue }) => {
        try {
            console.log('📝 선호 기사 등록 시도:', articleIds);
            const response = await api.post('/user-preference/random', {
                article_id: articleIds
            });

            console.log('✅ 선호 기사 등록 성공:', {
                응답_데이터: response.data,
                상태_코드: response.status,
                등록된_기사_수: articleIds.length
            });

            return response.data;
        } catch (err) {
            console.error('❌ 선호 기사 등록 실패:', {
                에러_메시지: err.message,
                상태_코드: err.response?.status,
                응답_데이터: err.response?.data
            });
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
                state.randomArticles = action.payload;  // 상태에 저장
                console.log('💾 랜덤기사 상태 데이터:', state.randomArticles);
            })
            .addCase(fetchRandomArticles.rejected, (state, action) => {
                console.log('에러 발생');  // 여기서 매핑된 데이터를 받음
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
                // state.selectedArticles = []; // 선택된 기사 목록 초기화
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
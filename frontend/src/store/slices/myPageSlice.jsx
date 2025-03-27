import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 닉네임 조회 액션
export const fetchNickname = createAsyncThunk(
    'myPage/fetchNickname',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/nickname');
            console.log('✅ 닉네임 조회 성공:', response.data);
            return response.data.data;
        } catch (err) {
            console.error('❌ 닉네임 조회 실패:', err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 활동 내역 조회 액션
export const fetchActivity = createAsyncThunk(
    'myPage/fetchActivity',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/activity');
            console.log('✅ 활동 내역 조회 성공:', response.data);
            return response.data.data;
        } catch (err) {
            console.error('❌ 활동 내역 조회 실패:', err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 퀴즈 풀이 현황 조회 액션 
export const fetchQuizHistory = createAsyncThunk(
    'myPage/fetchQuizHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/quiz');
            console.log('✅ 퀴즈 풀이 현황 조회 성공:', response.data);
            
            // 퀴즈 풀이 횟수에 따른 레벨 계산
            const quizLevels = {};
            const dates = response.data.data?.tryToDates || {};
            
            Object.entries(dates).forEach(([date, count]) => {
                // 실제 퀴즈 풀이 횟수를 그대로 사용
                quizLevels[date] = count;
            });
            
            return quizLevels;
        } catch (err) {
            console.error('❌ 퀴즈 풀이 현황 조회 실패:', err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    nickname: null,
    activity: {
        readArticlesCount: 0,
        scrapArticlesCount: 0,
        solvedQuizCount: 0
    },
    quizHistory: {},  // 퀴즈 풀이 현황 데이터 추가
    loading: false,
    error: null
};

const myPageSlice = createSlice({
    name: 'myPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 닉네임 조회
            .addCase(fetchNickname.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNickname.fulfilled, (state, action) => {
                state.loading = false;
                state.nickname = action.payload.nickname;
            })
            .addCase(fetchNickname.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 활동 내역 조회
            .addCase(fetchActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.activity = {
                    readArticlesCount: action.payload.readArticlesCount,
                    scrapArticlesCount: action.payload.scrapArticlesCount,
                    solvedQuizCount: action.payload.solvedQuizCount
                };
            })
            .addCase(fetchActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 퀴즈 풀이 현황 조회
            .addCase(fetchQuizHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.quizHistory = action.payload;
            })
            .addCase(fetchQuizHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default myPageSlice.reducer;


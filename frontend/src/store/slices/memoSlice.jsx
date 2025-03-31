import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 메모 조회 액션
export const fetchMemo = createAsyncThunk(
    'memo/fetchMemo',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/scraps/memos/${articleId}`);
            if (!response.data.data) {
                console.log('📝 메모가 없습니다.');
                return null;
            }
            console.log('✅ 메모 조회 응답:', {
                메모ID: response.data.data.memoId,
                메모내용: response.data.data.content,
                폴더아이디: response.data.data.folderId,
                스크랩아이디: response.data.data.scrapId,
            });
            return response.data.data;
        } catch (err) {
            console.error('❌ 메모 조회 실패:', {
                에러_메시지: err.message,
                상태_코드: err.response?.status,
                응답_데이터: err.response?.data
            });
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 메모 수정 액션
export const updateMemo = createAsyncThunk(
    'memo/updateMemo',
    async ({ memoId, content }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/scraps/memos/${memoId}`, {
                content: content
            });

            console.log('✅ 메모 수정 성공:', response.data);
            return response.data.data;
        } catch (err) {
            console.error('❌ 메모 수정 실패:', {
                에러_메시지: err.message,
                상태_코드: err.response?.status,
                응답_데이터: err.response?.data
            });
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    memo: null,
    loading: false,
    error: null
};

const memoSlice = createSlice({
    name: 'memo',
    initialState,
    reducers: {
        resetMemo: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            // 메모 조회
            .addCase(fetchMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemo.fulfilled, (state, action) => {
                state.loading = false;
                state.memo = action.payload;
            })
            .addCase(fetchMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 메모 수정
            .addCase(updateMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemo.fulfilled, (state, action) => {
                state.loading = false;
                state.memo = action.payload;
            })
            .addCase(updateMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetMemo } = memoSlice.actions;
export default memoSlice.reducer;
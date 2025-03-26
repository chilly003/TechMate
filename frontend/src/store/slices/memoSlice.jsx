import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  memo: {
    memoId: null,
    content: '',
    createdAt: '',
    lastModifiedAt: ''
  },
  loading: false,
  error: null
};

// 메모 조회 (articleId를 1로 고정)
export const fetchMemo = createAsyncThunk(
  'memo/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const articleId = 1; // 테스트를 위해 articleId를 1로 고정
      const res = await api.get(`/scraps/memos/${articleId}`);
      console.log('API 응답:', res.data); // 응답 로깅
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 메모 수정
export const updateMemo = createAsyncThunk(
  'memo/update',
  async ({ memoId, content }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/scraps/memos/${memoId}`, { content });
      console.log('API 응답:', res.data); // 응답 로깅
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 조회 처리
      .addCase(fetchMemo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemo.fulfilled, (state, action) => {
        state.memo = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchMemo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // 수정 처리
      .addCase(updateMemo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMemo.fulfilled, (state, action) => {
        state.memo = action.payload.data;
        state.loading = false;
      })
      .addCase(updateMemo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default memoSlice.reducer;
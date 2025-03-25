import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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

// 메모 조회
export const fetchMemo = createAsyncThunk(
  'memo/fetch',
  async (articleId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`v1/scraps/memos/${articleId}`);
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
      const res = await axios.patch(`v1/scraps/memos/${memoId}`, { content });
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
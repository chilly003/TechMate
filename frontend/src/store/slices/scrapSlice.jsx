// scrapeSlice.jsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  scraps: {
    content: [],
    pageable: {},
    size: 0,
    number: 0,
    sort: [],
    first: true,
    last: false,
    numberOfElements: 0,
    empty: false
  },
  loading: false,
  error: null
};

// 비동기 액션 생성자
export const fetchScraps = createAsyncThunk(
  'scraps/fetch',
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`v1/scraps/${folderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addScrap = createAsyncThunk(
  'scraps/add',
  async ({ articleId, folderId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`v1/scraps/${articleId}/folders/${folderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeScrap = createAsyncThunk(
  'scraps/remove',
  async (scrapId, { rejectWithValue }) => {
    try {
      await axios.delete(`v1/scraps/${scrapId}`);
      return scrapId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const scrapeSlice = createSlice({
  name: 'scrap',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 조회 처리
      //Immer 방식으로 상태 업데이트
      .addCase(fetchScraps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScraps.fulfilled, (state, action) => {
        state.scraps = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchScraps.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // 추가 처리
      .addCase(addScrap.fulfilled, (state, action) => {
        state.scraps.content.unshift(action.payload.data);
      })
      
      // 삭제 처리
      .addCase(removeScrap.fulfilled, (state, action) => {
        state.scraps.content = state.scraps.content.filter(
          scrap => scrap.scrapId !== action.payload
        );
      });
  }
});

export default scrapeSlice.reducer;

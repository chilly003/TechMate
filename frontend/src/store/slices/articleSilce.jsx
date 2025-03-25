import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IntroImage from "../../assets/images/people.jpg";

// Create dummy articles
const dummyArticles = Array.from({ length: 30 }, (_, index) => ({
  article_id: index + 1,
  title:
    index % 3 === 0
      ? "삼성전자, AI 반도체로 새로운 시장 개척 나서"
      : index % 3 === 1
      ? '김영진 KT 대표 "호텔 부문선, 본업 아냐...매각해 통신·AI 투자"[MWC25]'
      : "현대차, 자율주행 기술 혁신으로 미래 모빌리티 선도",
  content: "자회사그룹과 MWC 2025사업 업무협약...사우디에 연내 및 출시 목표",
  category: index % 3 === 0 ? "테크" : index % 3 === 1 ? "경제" : "산업",
  publisher: index % 2 === 0 ? "IT/일반" : "통신",
  imageUrl: IntroImage,
  isFeatured: index % 10 === 0,
}));

export const fetchArticles = createAsyncThunk(
  "article/fetchArticles",
  async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return dummyArticles;
  }
);

//특정 기사 데이터 가져옴
export const fetchArticle = createAsyncThunk(
  "article/fetchArticle",
  async (articleId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const article = dummyArticles.find((a) => a.article_id === articleId);
    if (!article) throw new Error("Article not found");
    return article;
  }
);

const initialState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    resetArticle: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle fetchArticle
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
//   updateScrapStatus: (state, action) => {
//     const { articleId, isScrapped } = action.payload;
//     const article = state.articles.find((a) => a.article_id === articleId);
//     if (article) article.isScrapped = isScrapped;
//   },
});

export const { resetArticle } = articleSlice.actions;

export default articleSlice.reducer;

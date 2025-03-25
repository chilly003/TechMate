import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/axios";
import MainArticleImage from '../../assets/images/MainArticleImage.jpg';

// Create dummy articles
const dummyArticles = Array.from({ length: 100 }, (_, index) => ({
    article_id: index + 1,
    title: index % 3 === 0
        ? "삼성전자, AI 반도체로 새로운 시장 개척 나서"
        : index % 3 === 1
            ? "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"
            : "현대차, 자율주행 기술 혁신으로 미래 모빌리티 선도",
    content: "자회사그룹과 MWC 2025사업 업무협약...사우디에 연내 및 출시 목표",
    category: index % 3 === 0 ? "테크" : index % 3 === 1 ? "경제" : "산업",
    publisher: index % 2 === 0 ? "IT/일반" : "통신",
    imageUrl: MainArticleImage,
    isFeatured: index % 10 === 0
}));

export const fetchArticles = createAsyncThunk(
    'article/fetchArticles',
    async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return dummyArticles;
    }
);

export const fetchArticle = createAsyncThunk(
    'article/fetchArticle',
    async (articleId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const article = dummyArticles.find(a => a.article_id === articleId);
        if (!article) throw new Error('Article not found');
        return article;
    }
);

/**
 * 추천 기사 리스트 조회
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchRecommendArticles = createAsyncThunk(
    "article/fetchRecommendArticles",
    async () => {
        const response = await api.get("/articles/recommend");
        return response.data.data; // Return the correct data structure
    }
)

/**
 * 기사 카테고리 리스트 조회
 * @param category : 요청 할 뉴스 카테고리
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchCategoryArticles = createAsyncThunk(
    "article/fetchCategoryArticles",
    async ({ category, page = 1, size = 10 }) => {
        const response = await api.get("/articles/category", {
            params: {
                category,
                page,
                size,
            }
        });
        return response.data;
    }
)

/**
 * 기사 상세 조회
 * @param articleId : 기사 ID
 * 
 * @return article [] : 기사 상세 정보
 */
export const fetchArticleDetail = createAsyncThunk(
    "article/fetchArticleDetail",
    async (articleId) => {
        const response = await api.get(`/articles/${articleId}`);
        return response.data;
    }
)

/**
 * 기사에 대한 좋아요를 누르는 API
 * @param articleId : 기사 ID
 * 
 */
export const toggleLikeArticle = createAsyncThunk(
    "article/toggleLikeArticle",
    async (articleId) => {
        const response = await api.get(`/articles/like/${articleId}`);
        return response.data;
    }
)

const initialState = {
    articles: [],
    currentArticle: null,
    recommendArticles: [],
    categoryArticles: [],
    loading: false,
    error: null,
};

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        resetArticle: (state) => {
            return initialState;
        }
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

            // Handle fetchArticleDetail
            .addCase(fetchArticleDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticleDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentArticle = action.payload;
            })
            .addCase(fetchArticleDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle fetchRecommendArticles
            .addCase(fetchRecommendArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.recommendArticles = action.payload;
                state.articles = action.payload.content; // Store the articles array in state.articles
            })
            .addCase(fetchRecommendArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle fetchCategoryArticles
            .addCase(fetchCategoryArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.categoryArticles = action.payload;
            })
            .addCase(fetchCategoryArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle toggleLikeArticle
            .addCase(toggleLikeArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleLikeArticle.fulfilled, (state, action) => {
                state.loading = false;
                // Update the like status in the current article if it exists
                if (state.currentArticle && state.currentArticle.article_id === action.payload.article_id) {
                    state.currentArticle = {
                        ...state.currentArticle,
                        isLiked: action.payload.isLiked
                    };
                }
                // Update the like status in the articles list if it exists
                state.articles = state.articles.map(article =>
                    article.article_id === action.payload.article_id
                        ? { ...article, isLiked: action.payload.isLiked }
                        : article
                );
            })
            .addCase(toggleLikeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetArticle } = articleSlice.actions;

export default articleSlice.reducer;

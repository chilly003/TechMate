import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    articleId: null,
    title: '',
    content: '',
    category: '',
    images: [],
    quizGenerated: false,
    quizzes: [],
    correctness: '',
    keywords: [],
    loading: false,
    error: null
};

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        setArticleData: (state, action) => {
            const {
                article_id,
                title,
                content,
                category,
                images,
                quiz_generated,
                quizzes,
                correctness,
                keywords
            } = action.payload;

            state.articleId = article_id;
            state.title = title;
            state.content = content;
            state.category = category;
            state.images = images;
            state.quizGenerated = quiz_generated;
            state.quizzes = quizzes;
            state.correctness = correctness;
            state.keywords = keywords;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetArticle: (state) => {
            return initialState;
        }
    }
});

export const {
    setArticleData,
    setLoading,
    setError,
    resetArticle
} = articleSlice.actions;

export default articleSlice.reducer;

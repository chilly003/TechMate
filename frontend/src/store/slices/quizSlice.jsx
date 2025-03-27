import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Initial state structure
const initialState = {
    quizzes: [],
    articleId: null,
    quizAttemptStatus: false,
    selectOptions: [],
    loading: false,
    error: null
};

/**
 * 퀴즈 데이터 조회
 * @param articleId : 기사 ID
 */
export const fetchQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (articleId) => {
        const response = await api.get(`/articles/${articleId}/quiz`);

        return response.data;
    }
);

/**
 * 퀴즈 답변 제출
 * @param payload : { articleId: number, answers: Array<{quizId: number, optionId: number}> }
 */
export const submitQuizAnswers = createAsyncThunk(
    'quiz/submitQuizAnswers',
    async ({ articleId, answers }) => {
        // const response = await api.post(`/articles/${articleId}/quiz`, answers);
        const response = await api.post(`/articles/${articleId}/quiz`, answers);
        console.log(response.data);
        return response.data;
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        resetQuiz: (state) => {
            return initialState;
        },
        updateSelectedOption: (state, action) => {
            const { quizId, optionId } = action.payload;
            const existingIndex = state.selectOptions.findIndex(
                option => option.quizId === quizId
            );

            if (existingIndex !== -1) {
                state.selectOptions[existingIndex].optionId = optionId;
            } else {
                state.selectOptions.push({ quizId, optionId });
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch quizzes
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.data.quizzes;
                state.articleId = action.payload.data.articleId;
                state.quizAttemptStatus = action.payload.data.quizAttemptStatus;
                state.selectOptions = action.payload.data.selectOptions || [];
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Submit answers
            .addCase(submitQuizAnswers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitQuizAnswers.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(submitQuizAnswers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetQuiz, updateSelectedOption } = quizSlice.actions;
export default quizSlice.reducer;
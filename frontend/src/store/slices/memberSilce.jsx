import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    nickname: '',
    accessToken: '',
    isNew: false
};

const memberSlice = createSlice({
    name: 'member',
    initialState,
    reducers: {
        setMember: (state, action) => {
            state.nickname = action.payload.nickname;
            state.accessToken = action.payload.accessToken;
            state.isNew = action.payload.isNew;
        },
        clearMember: (state) => {
            state.nickname = '';
            state.accessToken = '';
            state.isNew = false;
        }
    }
});

export const { setMember, clearMember } = memberSlice.actions;
export default memberSlice.reducer;

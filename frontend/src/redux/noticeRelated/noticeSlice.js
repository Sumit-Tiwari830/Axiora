import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    noticesList: [],
    loading: false,
    error: null,
    response: null,
};

const noticeSlice = createSlice({
    name: "notice",
    initialState,

    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSuccess: (state, action) => {
            state.noticesList = action.payload || [];
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getFailed: (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        },

        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        resetNoticeState: (state) => {
            state.noticesList = [];
            state.loading = false;
            state.error = null;
            state.response = null;
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    resetNoticeState,
} = noticeSlice.actions;

export const noticeReducer = noticeSlice.reducer;
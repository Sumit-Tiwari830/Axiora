import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complainsList: [],
    loading: false,
    error: null,
    response: null,
};

const complainSlice = createSlice({
    name: "complain",
    initialState,

    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSuccess: (state, action) => {
            state.complainsList = action.payload || [];
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

        resetComplainState: (state) => {
            state.complainsList = [];
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
    resetComplainState,
} = complainSlice.actions;

export const complainReducer = complainSlice.reducer;
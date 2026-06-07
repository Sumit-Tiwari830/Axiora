import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teachersList: [],
    teacherDetails: null,
    loading: false,
    error: null,
    response: null,
};

const teacherSlice = createSlice({
    name: "teacher",
    initialState,

    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        doneSuccess: (state, action) => {
            state.teacherDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getSuccess: (state, action) => {
            state.teachersList = action.payload || [];
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

        postDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        resetTeacherState: (state) => {
            state.teachersList = [];
            state.teacherDetails = null;
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
    doneSuccess,
    postDone,
    resetTeacherState,
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const studentSlice = createSlice({
    name: "student",
    initialState,

    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },

        getSuccess: (state, action) => {
            state.studentsList = action.payload || [];
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getFailed: (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
            state.statestatus = "failed";
        },

        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.statestatus = "error";
        },

        underStudentControl: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "idle";
        },

        resetStudentState: (state) => {
            state.studentsList = [];
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "idle";
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone,
    underStudentControl,
    resetStudentState,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;
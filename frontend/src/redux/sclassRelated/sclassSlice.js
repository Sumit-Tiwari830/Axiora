import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sclassesList: [],
    sclassStudents: [],
    subjectsList: [],

    sclassDetails: {},
    subjectDetails: {},

    loading: false,
    subloading: false,

    error: null,
    response: null,
    getresponse: null,
};

const sclassSlice = createSlice({
    name: "sclass",
    initialState,

    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
        },


        getSubDetailsRequest: (state) => {
            state.subloading = true;
            state.error = null;
        },

        getSuccess: (state, action) => {
            state.sclassesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },

        getStudentsSuccess: (state, action) => {
            state.sclassStudents = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },

        getSubjectsSuccess: (state, action) => {
            state.subjectsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getFailed: (state, action) => {
            state.subjectsList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },

        getFailedTwo: (state, action) => {
            state.sclassesList = [];
            state.sclassStudents = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },

        getError: (state, action) => {
            state.loading = false;
            state.subloading = false;
            state.error = action.payload;
        },

        detailsSuccess: (state, action) => {
            state.sclassDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getSubDetailsSuccess: (state, action) => {
            state.subjectDetails = action.payload;
            state.subloading = false;
            state.error = null;
            state.response = null;
        },

        resetSubjects: (state) => {
            state.subjectsList = [];
            state.sclassesList = [];
            state.subjectDetails = {};
            state.sclassDetails = {};
        },


    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getSubjectsSuccess,
    detailsSuccess,
    getFailedTwo,
    resetSubjects,
    getSubDetailsSuccess,
    getSubDetailsRequest,
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;

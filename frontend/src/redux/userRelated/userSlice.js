import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");

const initialState = {
    status: "idle",
    userDetails: {},
    tempDetails: {},
    loading: false,

    currentUser: savedUser ? JSON.parse(savedUser) : null,
    currentRole: savedUser ? JSON.parse(savedUser).role : null,

    error: null,
    response: null,
    darkMode: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        authRequest: (state) => {
            state.status = "loading";
            state.loading = true;
            state.error = null;
            state.response = null;
        },

        underControl: (state) => {
            state.status = "idle";
            state.response = null;
            state.error = null;
        },

        stuffAdded: (state, action) => {
            state.status = "added";
            state.loading = false;
            state.tempDetails = action.payload;
            state.response = null;
            state.error = null;
        },

        authSuccess: (state, action) => {
            state.status = "success";
            state.loading = false;

            state.currentUser = action.payload;
            state.currentRole = action.payload.role;

            localStorage.setItem("user", JSON.stringify(action.payload));

            state.response = null;
            state.error = null;
        },

        authFailed: (state, action) => {
            state.status = "failed";
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        },

        authError: (state, action) => {
            state.status = "error";
            state.loading = false;
            state.error = action.payload;
        },

        authLogout: (state) => {
            localStorage.removeItem("user");

            state.currentUser = null;
            state.currentRole = null;

            state.status = "idle";
            state.loading = false;
            state.error = null;
            state.response = null;
            state.userDetails = {};
            state.tempDetails = {};
        },

        doneSuccess: (state, action) => {
            state.status = "success";
            state.loading = false;
            state.userDetails = action.payload;
            state.error = null;
            state.response = null;
        },

        getDeleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getRequest: (state) => {
            state.loading = true;
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

        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
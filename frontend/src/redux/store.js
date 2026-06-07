import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userRelated/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
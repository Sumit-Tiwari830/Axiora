import axios from "axios";
import {
    authRequest,
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
} from "./userSlice";

const api = import.meta.env.VITE_REACT_APP_BASE_URL;

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const { data } = await axios.post(
            `${api}/${role}Login`,
            fields,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (data?.role) {
            dispatch(authSuccess(data));
        } else {
            dispatch(authFailed(data?.message || "Login failed"));
        }
    } catch (err) {
        dispatch(authError(err.response?.data?.message || err.message));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const { data } = await axios.post(
            `${api}/${role}Reg`,
            fields,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (data?.schoolName) {
            dispatch(authSuccess(data));
        } else if (data?.school) {
            dispatch(stuffAdded(data));
        } else {
            dispatch(authFailed(data?.message || "Registration failed"));
        }
    } catch (err) {
        dispatch(authError(err.response?.data?.message || err.message));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data } = await axios.get(
            `${api}/${address}/${id}`
        );

        dispatch(doneSuccess(data));
    } catch (err) {
        dispatch(getError(err.response?.data?.message || err.message));
    }
};

// Delete disabled intentionally
export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    dispatch(
        getFailed("Sorry, delete functionality is currently disabled.")
    );
};

export const updateUser =
    (fields, id, address) => async (dispatch) => {
        dispatch(getRequest());

        try {
            const { data } = await axios.put(
                `${api}/${address}/${id}`,
                fields,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (data?.schoolName) {
                dispatch(authSuccess(data));
            } else {
                dispatch(doneSuccess(data));
            }
        } catch (err) {
            dispatch(getError(err.response?.data?.message || err.message));
        }
    };

export const addStuff =
    (fields, address) => async (dispatch) => {
        dispatch(authRequest());

        try {
            const { data } = await axios.post(
                `${api}/${address}Create`,
                fields,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (data?.message) {
                dispatch(authFailed(data.message));
            } else {
                dispatch(stuffAdded(data));
            }
        } catch (err) {
            dispatch(authError(err.response?.data?.message || err.message));
        }
    };
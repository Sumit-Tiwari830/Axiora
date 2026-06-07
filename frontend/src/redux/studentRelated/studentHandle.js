import axios from "axios";
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone,
} from "./studentSlice";

const baseUrl = process.env.REACT_APP_BASE_URL;

// ==================== GET ALL STUDENTS ====================

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/Students/${id}`
        );

        if (res.data?.message) {
            dispatch(getFailed(res.data.message));
            return;
        }

        dispatch(getSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== UPDATE STUDENT ====================

export const updateStudentFields =
    (id, fields, address) => async (dispatch) => {
        dispatch(getRequest());

        try {
            const res = await axios.put(
                `${baseUrl}/${address}/${id}`,
                fields,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data?.message) {
                dispatch(getFailed(res.data.message));
                return;
            }

            dispatch(stuffDone());
        } catch (err) {
            dispatch(getError(err.response?.data || err.message));
        }
    };

// ==================== REMOVE STUDENT DATA ====================

export const removeStuff =
    (id, address) => async (dispatch) => {
        dispatch(getRequest());

        try {
            const res = await axios.put(
                `${baseUrl}/${address}/${id}`
            );

            if (res.data?.message) {
                dispatch(getFailed(res.data.message));
                return;
            }

            dispatch(stuffDone());
        } catch (err) {
            dispatch(getError(err.response?.data || err.message));
        }
    };
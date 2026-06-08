import axios from "axios";
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess,
} from "./teacherSlice";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// ==================== GET ALL TEACHERS ====================

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/Teachers/${id}`
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

// ==================== GET TEACHER DETAILS ====================

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/Teacher/${id}`
        );

        dispatch(doneSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== ASSIGN SUBJECT ====================

export const updateTeachSubject =
    (teacherId, teachSubject) => async (dispatch) => {
        dispatch(getRequest());

        try {
            const res = await axios.put(
                `${baseUrl}/TeacherSubject`,
                {
                    teacherId,
                    teachSubject,
                },
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

            dispatch(postDone());
        } catch (err) {
            dispatch(getError(err.response?.data || err.message));
        }
    };
import axios from "axios";
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest,
} from "./sclassSlice";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// ==================== CLASSES ====================

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(`${baseUrl}/${address}List/${id}`);

        if (res.data?.message) {
            dispatch(getFailedTwo(res.data.message));
            return;
        }

        dispatch(getSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== CLASS STUDENTS ====================

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/Sclass/Students/${id}`
        );

        if (res.data?.message) {
            dispatch(getFailedTwo(res.data.message));
            return;
        }

        dispatch(getStudentsSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== CLASS DETAILS ====================

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/${address}/${id}`
        );

        dispatch(detailsSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== SUBJECT LIST ====================

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/${address}/${id}`
        );

        if (res.data?.message) {
            dispatch(getFailed(res.data.message));
            return;
        }

        dispatch(getSubjectsSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== FREE SUBJECTS ====================

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/FreeSubjectList/${id}`
        );

        if (res.data?.message) {
            dispatch(getFailed(res.data.message));
            return;
        }

        dispatch(getSubjectsSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};

// ==================== SUBJECT DETAILS ====================

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());

    try {
        const res = await axios.get(
            `${baseUrl}/${address}/${id}`
        );

        dispatch(getSubDetailsSuccess(res.data));
    } catch (err) {
        dispatch(getError(err.response?.data || err.message));
    }
};
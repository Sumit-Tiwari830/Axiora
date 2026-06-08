import axios from "axios";
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
} from "./noticeSlice";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// ==================== GET ALL NOTICES ====================

export const getAllNotices =
    (id, address) => async (dispatch) => {
        dispatch(getRequest());

        try {
            const res = await axios.get(
                `${baseUrl}/${address}List/${id}`
            );

            if (res.data?.message) {
                dispatch(getFailed(res.data.message));
                return;
            }

            dispatch(getSuccess(res.data));
        } catch (err) {
            dispatch(
                getError(err.response?.data || err.message)
            );
        }
    };
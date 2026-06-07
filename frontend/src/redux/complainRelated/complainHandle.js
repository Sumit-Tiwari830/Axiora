import axios from "axios";
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
} from "./complainSlice";

const baseUrl = process.env.REACT_APP_BASE_URL;

// ==================== GET ALL COMPLAINS ====================

export const getAllComplains =
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